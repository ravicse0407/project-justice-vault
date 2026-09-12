import os
import json
import time
from datetime import datetime
from typing import List, Dict, Any, Optional
from pathlib import Path
from ..config import settings
from ..models.schemas import AuditRecord

class AuditService:
    def __init__(self):
        self.log_file = Path(settings.DATA_DIR) / "audit_log.json"
        self._memory_logs: List[AuditRecord] = []
        self._load_logs()

    def _load_logs(self):
        if self.log_file.exists():
            try:
                with open(self.log_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self._memory_logs = [AuditRecord(**record) for record in data]
            except Exception:
                self._memory_logs = []
        else:
            # Seed initial audit trail
            initial_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            self.record_event(
                user_id="SYSTEM_BOOT",
                role="auditor",
                event_type="VAULT_INITIALIZATION",
                query=None,
                retrieved_source_ids=["DOC-PMAY-U2-2026", "DOC-SCHOLARSHIP-CENTRAL-2026", "DOC-ONORC-2026"],
                confidence="HIGH",
                details={"message": "Justice Vault initialized with 7 verified official seed standards."}
            )

    def _persist(self):
        try:
            with open(self.log_file, "w", encoding="utf-8") as f:
                json.dump([record.model_dump() for record in self._memory_logs], f, indent=2)
        except Exception as e:
            print(f"Error persisting audit log: {e}")

    def record_event(
        self,
        user_id: str,
        role: str,
        event_type: str,
        query: Optional[str] = None,
        retrieved_source_ids: Optional[List[str]] = None,
        confidence: Optional[str] = None,
        conflict_detected: bool = False,
        action_generated: bool = False,
        external_action_confirmed: bool = False,
        details: Optional[Dict[str, Any]] = None
    ) -> AuditRecord:
        record_id = f"AUD-{int(time.time() * 1000)}"
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        record = AuditRecord(
            audit_id=record_id,
            timestamp=timestamp,
            user_id=user_id,
            role=role,
            event_type=event_type,
            query=query,
            retrieved_source_ids=retrieved_source_ids or [],
            confidence=confidence,
            conflict_detected=conflict_detected,
            action_generated=action_generated,
            external_action_confirmed=external_action_confirmed,
            details=details or {}
        )
        self._memory_logs.insert(0, record)
        self._persist()
        return record

    def get_logs(self, limit: int = 50, event_type: Optional[str] = None) -> List[AuditRecord]:
        logs = self._memory_logs
        if event_type:
            logs = [l for l in logs if l.event_type == event_type]
        return logs[:limit]

audit_service = AuditService()
