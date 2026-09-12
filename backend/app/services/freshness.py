import json
from pathlib import Path
from typing import Optional, List, Tuple
from ..config import settings
from ..models.schemas import DocumentRecord, FreshnessNotice

class FreshnessEngine:
    def __init__(self):
        self.rule_graph_file = Path(settings.DATA_DIR) / "rule_graph.json"
        self.supersedes_map = {}
        self.load_rules()

    def load_rules(self):
        if self.rule_graph_file.exists():
            try:
                with open(self.rule_graph_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    for rel in data.get("relationships", []):
                        if rel.get("relation") == "RULE_SUPERSEDES":
                            self.supersedes_map[rel.get("target")] = {
                                "current_doc_id": rel.get("source"),
                                "topic": rel.get("topic"),
                                "details": rel.get("details", {})
                            }
            except Exception as e:
                print(f"Error loading freshness rules: {e}")

    def check_freshness(
        self,
        retrieved_docs: List[DocumentRecord],
        query: str
    ) -> Optional[FreshnessNotice]:
        q_lower = query.lower()
        is_onorc_slip_query = any(k in q_lower for k in ["migration slip", "manual slip", "form m-1", "m-1", "dealer slip"])
        is_ration_query = any(k in q_lower for k in ["ration", "onorc", "nfsa"])

        # Check if superseded doc is in retrieved docs AND the query is relevant
        for doc in retrieved_docs:
            if doc.status == "SUPERSEDED" or (doc.id in self.supersedes_map and is_ration_query):
                rule_info = self.supersedes_map.get(doc.id, {})
                current_id = rule_info.get("current_doc_id", "DOC-ONORC-2026")
                details = rule_info.get("details", {})
                
                notice_text = (
                    details.get("notice") or 
                    f"Older version detected ({doc.version}). A newer official document ({current_id}) has superseded this requirement."
                )
                recommended = (
                    f"Rely exclusively on current document {current_id}. "
                    "Physical manual migration slips are completely discontinued; 100% biometric e-PoS authentication is now standard."
                )

                return FreshnessNotice(
                    is_outdated=True,
                    superseded_doc_id=doc.id,
                    current_doc_id=current_id,
                    notice=notice_text,
                    recommended_action=recommended
                )

        if is_onorc_slip_query:
            return FreshnessNotice(
                is_outdated=True,
                superseded_doc_id="DOC-ONORC-2024",
                current_doc_id="DOC-ONORC-2026",
                notice="Older version detected. Physical manual migration slips (Form M-1) under the 2024 manual have been superseded.",
                recommended_action="Do not use manual paper slips. As per the 2026 National Order, biometric authentication on e-PoS is mandatory and sufficient."
            )

        return None

freshness_engine = FreshnessEngine()
