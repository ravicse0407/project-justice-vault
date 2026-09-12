from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class DocumentSection(BaseModel):
    section_id: str
    title: str
    page: int
    text: str

class DocumentRecord(BaseModel):
    id: str
    title: str
    issuer: str
    category: str
    url: str
    version: str
    publication_date: str
    effective_date: str
    expiry_date: Optional[str] = None
    status: str  # CURRENT, EXPIRED, SUPERSEDED, UNKNOWN
    supersedes_doc_id: Optional[str] = None
    sha256: str
    dataset_tier: str = "VERIFIED_OFFICIAL_SEED_DATA"
    is_demo_seed: bool = True
    summary: str
    sections: List[DocumentSection] = []

class ClaimEvidence(BaseModel):
    document_id: str
    document_title: str
    issuer: str
    version: str
    effective_date: str
    section: str
    page: Optional[int] = None
    retrieved_text: str
    source_url: str
    sha256: str
    integrity_verified: bool = True

class ClaimGrounding(BaseModel):
    claim: str
    evidence: List[ClaimEvidence] = []
    supported: bool = True
    confidence: float = 0.95

class ConflictSource(BaseModel):
    doc_id: str
    issuer: str
    claim: str
    deadline: Optional[str] = None

class ConflictItem(BaseModel):
    topic: str
    description: str
    source_a: ConflictSource
    source_b: ConflictSource
    recommended_action: str

class FreshnessNotice(BaseModel):
    is_outdated: bool
    superseded_doc_id: str
    current_doc_id: str
    notice: str
    recommended_action: str

class ActionStep(BaseModel):
    step_number: int
    title: str
    detail: str
    is_completed: bool = False

class ActionChecklist(BaseModel):
    service_name: str
    steps: List[ActionStep]
    required_documents: List[str]
    deadline: Optional[str] = None
    official_portal_url: str
    official_portal_name: str
    requires_confirmation: bool = True

class QueryRequest(BaseModel):
    query: str
    language: str = "en"  # "en" or "hi"
    user_role: str = "citizen"  # "citizen", "officer", "auditor"

class EvidenceStatus(BaseModel):
    source_verified: bool = True
    freshness_checked: bool = True
    no_conflict_detected: bool = True
    hash_verified: bool = True

class QueryResponse(BaseModel):
    query: str
    language: str
    plain_language_answer: str
    confidence: str  # "HIGH", "MEDIUM", "LOW"
    confidence_score: float
    evidence_status: EvidenceStatus
    claims: List[ClaimGrounding] = []
    conflict: Optional[ConflictItem] = None
    freshness: Optional[FreshnessNotice] = None
    action_checklist: Optional[ActionChecklist] = None
    sources_consulted: List[Dict[str, Any]] = []
    is_demo_mode: bool = True
    processing_time_ms: float = 0.0

class DocumentUploadResponse(BaseModel):
    document_id: str
    filename: str
    sha256: str
    issuer: str
    detected_version: str
    status: str
    page_count: int
    extracted_text_preview: str
    ocr_applied: bool
    ocr_fallback_notice: Optional[str] = None
    classified_service: str
    indexed_claims_count: int
    processing_timestamp: str

class ActionValidationRequest(BaseModel):
    checklist: ActionChecklist
    completed_steps: List[int] = []

class ActionValidationResult(BaseModel):
    is_valid: bool
    completion_percentage: float
    missing_items: List[str] = []
    ready_for_official_route: bool = False
    validation_timestamp: str

class ActionConfirmRequest(BaseModel):
    service_name: str
    official_portal_url: str
    confirmed_by_user: bool = True
    timestamp: str

class ActionConfirmResponse(BaseModel):
    confirmation_id: str
    status: str  # "CONFIRMED_CLIENT_SIDE_ROUTING"
    notice: str
    portal_url: str
    recorded_at: str

class AuditRecord(BaseModel):
    audit_id: str
    timestamp: str
    user_id: str
    role: str
    event_type: str
    query: Optional[str] = None
    retrieved_source_ids: List[str] = []
    confidence: Optional[str] = None
    conflict_detected: bool = False
    action_generated: bool = False
    external_action_confirmed: bool = False
    details: Dict[str, Any] = {}

class BenchmarkMetric(BaseModel):
    metric_name: str
    target: str
    actual: str
    test_set: str
    status: str
    description: str
