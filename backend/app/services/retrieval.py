import os
import json
import re
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
from ..config import settings
from ..models.schemas import DocumentRecord, DocumentSection

class RetrievalService:
    def __init__(self):
        self.sources_file = Path(settings.DATA_DIR) / "sources.json"
        self.documents: Dict[str, DocumentRecord] = {}
        self.load_documents()

    def load_documents(self):
        if self.sources_file.exists():
            try:
                with open(self.sources_file, "r", encoding="utf-8") as f:
                    raw_docs = json.load(f)
                    for d in raw_docs:
                        doc = DocumentRecord(**d)
                        self.documents[doc.id] = doc
            except Exception as e:
                print(f"Error loading sources: {e}")

    def add_document(self, doc: DocumentRecord):
        self.documents[doc.id] = doc

    def get_document(self, doc_id: str) -> Optional[DocumentRecord]:
        return self.documents.get(doc_id)

    def list_documents(
        self,
        status: Optional[str] = None,
        category: Optional[str] = None,
        search_query: Optional[str] = None
    ) -> List[DocumentRecord]:
        results = list(self.documents.values())
        if status and status.upper() != "ALL":
            results = [d for d in results if d.status.upper() == status.upper()]
        if category and category.upper() != "ALL":
            results = [d for d in results if category.lower() in d.category.lower()]
        if search_query:
            q_tokens = self._tokenize(search_query)
            filtered = []
            for d in results:
                d_text = f"{d.title} {d.issuer} {d.summary} {' '.join(s.text for s in d.sections)}"
                d_tokens = set(self._tokenize(d_text))
                if any(t in d_tokens for t in q_tokens):
                    filtered.append(d)
            results = filtered
        return results

    def _tokenize(self, text: str) -> List[str]:
        cleaned = re.sub(r'[^a-zA-Z0-9\u0900-\u097F\s]', ' ', text.lower())
        stopwords = {
            "a", "an", "the", "in", "on", "at", "for", "to", "of", "and", "or", "is", "are", 
            "what", "which", "where", "how", "am", "i", "my", "me", "do", "does", "can", "you",
            "this", "that", "it", "with", "as", "by", "from", "register", "registration", "application",
            "apply", "form", "check", "need", "get", "tell", "explain", "info", "information", "details",
            "give", "please", "know", "want"
        }
        tokens = [t for t in cleaned.split() if len(t) > 1 and t not in stopwords]
        return tokens

    def _has_word(self, keyword: str, text: str) -> bool:
        pattern = r'\b' + re.escape(keyword) + r'\b'
        return bool(re.search(pattern, text, re.IGNORECASE))

    def retrieve_relevant_sections(
        self,
        query: str,
        top_k: int = 4
    ) -> List[Tuple[DocumentRecord, DocumentSection, float]]:
        """
        Hybrid retrieval scoring:
        - BM25-style term frequency & query coverage
        - Service domain boost with regex word boundaries (\b)
        - Strict threshold to avoid false positive retrievals
        """
        query_tokens = self._tokenize(query)
        if not query_tokens:
            return []

        scored_sections: List[Tuple[DocumentRecord, DocumentSection, float]] = []

        domain_keywords = {
            "pmay": ["pmay", "pmay-u", "awas", "housing", "pucca", "ews", "lig", "mig", "urban", "income limit", "pm awas"],
            "scholarship": ["scholarship", "post-matric", "matric", "student", "deadline", "college", "nsp", "sc", "st", "obc"],
            "onorc": ["onorc", "ration", "migration", "migration slip", "slip", "fps", "epos", "biometric", "food grains", "ration card"],
            "pmjay": ["ayushman", "pmjay", "pm-jay", "70", "senior", "health", "hospital", "hospitalization", "500000", "vay vandana"],
            "digilocker": ["digilocker", "digital locker", "rule 9a", "physical document", "certificate"],
            "pmkisan": ["pmkisan", "pm-kisan", "kisan", "farmer", "installment", "land seeding", "land record", "ekyc"]
        }

        q_lower = query.lower()

        for doc in self.documents.values():
            # Don't retrieve superseded documents as primary results unless explicitly queried
            is_superseded = (doc.status == "SUPERSEDED")
            is_slip_query = any(self._has_word(k, q_lower) for k in ["migration slip", "manual slip", "form m-1", "m-1", "2024"])
            if is_superseded and not is_slip_query:
                continue

            for sec in doc.sections:
                sec_text = f"{doc.title} {sec.title} {sec.text}".lower()
                sec_tokens = self._tokenize(sec_text)
                sec_token_set = set(sec_tokens)

                matched_tokens = [t for t in query_tokens if t in sec_token_set]
                overlap_ratio = len(matched_tokens) / len(query_tokens) if query_tokens else 0.0

                domain_boost = 0.0
                for domain, keywords in domain_keywords.items():
                    query_has_kw = any(self._has_word(kw, q_lower) for kw in keywords)
                    sec_has_kw = any(self._has_word(kw, sec_text) for kw in keywords)
                    if query_has_kw and sec_has_kw:
                        domain_boost += 0.40

                total_score = (overlap_ratio * 0.6) + domain_boost

                # Only include if there is substantial token overlap or substantive domain match
                if total_score >= 0.40 and (overlap_ratio >= 0.25 or domain_boost > 0):
                    scored_sections.append((doc, sec, total_score))

        scored_sections.sort(key=lambda x: x[2], reverse=True)
        return scored_sections[:top_k]

retrieval_service = RetrievalService()
