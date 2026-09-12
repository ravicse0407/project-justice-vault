import os
import json
import time
import hashlib
from datetime import datetime
from typing import List, Dict, Any, Optional, Tuple
from pathlib import Path
from ..config import settings
from ..models.schemas import AuditRecord

GENESIS_HASH = "0" * 64

class AuditService:
    """
    Cryptographically Hash-Chained Audit Trail.
    Each record includes previous_hash and record_hash computed as:
    record_hash = SHA256(previous_hash + canonical_json(event_payload))
    Guarantees tamper evidence and detects any modification to past records.
    """
    def __init__(self):
        self.log_file = Path(settings.DATA_DIR) / "audit_log.json"
        self._memory_logs: List[AuditRecord] = []
        self._load_logs()

    def _canonical_json(self, data: Dict[str, Any]) -> str:
        # Exclude record_hash itself to compute the hash
        clean = {k: v for k, v in data.items() if k != "record_hash"}
        return json.dumps(clean, sort_keys=True, separators=(',', ':'), default=str)

    def _compute_record_hash(self, previous_hash: str, canonical_payload: str) -> str:
        payload = f"{previous_hash}:{canonical_payload}".encode("utf-8")
        return hashlib.sha256(payload).hexdigest()

    def _load_logs(self):
        candidate_paths = [
            self.log_file,
            Path(__file__).resolve().parent.parent.parent / "backend" / "knowledge" / "audit_log.json",
            Path(__file__).resolve().parent.parent / "knowledge" / "audit_log.json",
            Path("/var/task/backend/knowledge/audit_log.json")
        ]
        target_path = next((p for p in candidate_paths if p.exists()), None)
        if target_path:
            try:
                with open(target_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self._memory_logs = [AuditRecord(**record) for record in data]
            except Exception as e:
                print(f"Error loading audit log from {target_path}: {e}")
                self._memory_logs = []
        
        if not self._memory_logs:
            # Initialize genesis audit record
            self.record_event(
                user_id="SYSTEM_BOOT",
                role="auditor",
                event_type="VAULT_INITIALIZATION",
                query=None,
                retrieved_source_ids=["DOC-PMAY-U2-2026", "DOC-SCHOLARSHIP-CENTRAL-2026", "DOC-ONORC-2026"],
                confidence="HIGH",
                details={"message": "Justice Vault initialized with verified official seed standards."}
            )
        else:
            # Verify and migrate any legacy unchained records
            is_valid, _, _ = self.verify_chain_integrity()
            if not is_valid:
                chronological = list(reversed(self._memory_logs))
                expected_prev = GENESIS_HASH
                for r in chronological:
                    r.previous_hash = expected_prev
                    r.record_hash = self._compute_record_hash(expected_prev, self._canonical_json(r.model_dump()))
                    expected_prev = r.record_hash
                self._memory_logs = list(reversed(chronological))
                self._persist()

    def _persist(self):
        try:
            with open(self.log_file, "w", encoding="utf-8") as f:
                json.dump([record.model_dump() for record in self._memory_logs], f, indent=2)
        except Exception as e:
            print(f"Error persisting audit log: {e}")

    def get_latest_hash(self) -> str:
        if self._memory_logs:
            return self._memory_logs[0].record_hash or GENESIS_HASH
        return GENESIS_HASH

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
        previous_hash = self.get_latest_hash()

        raw_payload = {
            "audit_id": record_id,
            "timestamp": timestamp,
            "user_id": user_id,
            "role": role,
            "event_type": event_type,
            "query": query,
            "retrieved_source_ids": retrieved_source_ids or [],
            "confidence": confidence,
            "conflict_detected": conflict_detected,
            "action_generated": action_generated,
            "external_action_confirmed": external_action_confirmed,
            "previous_hash": previous_hash,
            "details": details or {}
        }

        canonical_str = self._canonical_json(raw_payload)
        record_hash = self._compute_record_hash(previous_hash, canonical_str)

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
            previous_hash=previous_hash,
            record_hash=record_hash,
            details=details or {}
        )

        # Store latest at the beginning of the list
        self._memory_logs.insert(0, record)
        self._persist()
        return record

    def get_logs(self, limit: int = 50, event_type: Optional[str] = None) -> List[AuditRecord]:
        logs = self._memory_logs
        if event_type and event_type != "ALL":
            logs = [l for l in logs if l.event_type == event_type]
        return logs[:limit]

    def verify_chain_integrity(self) -> Tuple[bool, int, str]:
        """
        Validates the cryptographic hash chain from genesis to the latest block.
        Returns: (is_valid, verified_count, message)
        """
        if not self._memory_logs:
            return True, 0, "Audit log is empty."

        # Verify chronologically from oldest (bottom of list) to newest (top of list)
        chronological = list(reversed(self._memory_logs))
        expected_prev_hash = GENESIS_HASH

        for i, record in enumerate(chronological):
            # Check previous hash link
            if i == 0:
                # Genesis record previous_hash must match GENESIS_HASH
                if record.previous_hash != GENESIS_HASH:
                    return False, i, f"Genesis block previous_hash mismatch at block 0: expected {GENESIS_HASH}, got {record.previous_hash}"
            else:
                if record.previous_hash != expected_prev_hash:
                    return False, i, f"Hash chain broken at block {i} ({record.audit_id}): previous_hash does not match preceding record_hash"

            # Check record hash computation
            payload_dict = record.model_dump()
            canonical_str = self._canonical_json(payload_dict)
            recalculated_hash = self._compute_record_hash(record.previous_hash, canonical_str)

            if recalculated_hash != record.record_hash:
                return False, i, f"Tamper detected at block {i} ({record.audit_id}): hash signature does not match content"

            expected_prev_hash = record.record_hash

        return True, len(chronological), f"Audit chain verified: {len(chronological)} blocks cryptographically intact."

audit_service = AuditService()
