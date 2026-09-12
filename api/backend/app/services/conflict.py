import json
from pathlib import Path
from typing import Optional, List, Dict, Any
from ..config import settings
from ..models.schemas import DocumentRecord, ConflictItem, ConflictSource

class ConflictDetector:
    def __init__(self):
        self.rule_graph_file = Path(settings.DATA_DIR) / "rule_graph.json"
        self.conflict_rules = []
        self.load_conflict_rules()

    def load_conflict_rules(self):
        if self.rule_graph_file.exists():
            try:
                with open(self.rule_graph_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    for rel in data.get("relationships", []):
                        if rel.get("relation") == "RULE_CONFLICTS":
                            self.conflict_rules.append(rel)
            except Exception as e:
                print(f"Error loading conflict rules: {e}")

    def detect_conflicts(
        self,
        retrieved_docs: List[DocumentRecord],
        query: str
    ) -> Optional[ConflictItem]:
        """
        Detects if retrieved documents or the query context trigger cross-source conflicts.
        Specifically handles:
        - Central vs State scholarship deadline disagreement (Nov 30 vs Oct 31)
        - Conflicting eligibility limits or conflicting fee schedules
        """
        retrieved_ids = {d.id for d in retrieved_docs}
        q_lower = query.lower()

        # Check scholarship query specifically or retrieved conflicting pair
        is_scholarship_query = any(k in q_lower for k in ["scholarship", "post-matric", "post matric", "nsp", "scholarship deadline"])
        is_deadline_query = any(k in q_lower for k in ["deadline", "last date", "due date", "cutoff", "when"])

        # Check explicit graph conflict rules
        for rule in self.conflict_rules:
            src = rule.get("source")
            tgt = rule.get("target")
            
            # If both documents are retrieved, or query asks about the conflicting topic
            if (src in retrieved_ids and tgt in retrieved_ids) or (is_scholarship_query and is_deadline_query):
                details = rule.get("conflict_details", {})
                src_a_data = details.get("source_a", {})
                src_b_data = details.get("source_b", {})
                
                return ConflictItem(
                    topic=rule.get("topic", "Conflicting Official Deadlines"),
                    description="Official Government notifications disagree on the operative application deadline.",
                    source_a=ConflictSource(
                        doc_id=src_a_data.get("doc_id", "DOC-SCHOLARSHIP-CENTRAL-2026"),
                        issuer=src_a_data.get("issuer", "Ministry of Social Justice and Empowerment (Central)"),
                        claim=src_a_data.get("claim", "National Scholarship Portal student submission deadline is November 30, 2026."),
                        deadline=src_a_data.get("deadline", "2026-11-30")
                    ),
                    source_b=ConflictSource(
                        doc_id=src_b_data.get("doc_id", "DOC-SCHOLARSHIP-STATE-2026"),
                        issuer=src_b_data.get("issuer", "State Directorate of Higher Education"),
                        claim=src_b_data.get("claim", "State portal collegiate verification and student submission cutoff is October 31, 2026."),
                        deadline=src_b_data.get("deadline", "2026-10-31")
                    ),
                    recommended_action=details.get(
                        "recommended_action",
                        "Please verify with your college verification officer immediately. State quotas require submission by October 31, 2026 despite the central November 30 deadline."
                    )
                )

        return None

conflict_detector = ConflictDetector()
