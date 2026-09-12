from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class GraphEntity(BaseModel):
    id: str
    type: str  # Service, Scheme, Eligibility, Document, Authority, Deadline, Route
    name: str
    authority: Optional[str] = None
    portal: Optional[str] = None

class GraphRelationship(BaseModel):
    source: str
    relation: str  # SERVICE_REQUIRES_DOCUMENT, SERVICE_HAS_DEADLINE, SERVICE_APPLIES_TO, RULE_SUPERSEDES, RULE_CONFLICTS
    target: str
    topic: Optional[str] = None
    authority_doc_id: Optional[str] = None
    section: Optional[str] = None
    conflict_details: Optional[Dict[str, Any]] = None
    details: Optional[Dict[str, Any]] = None

class RuleGraph(BaseModel):
    entities: List[GraphEntity] = []
    relationships: List[GraphRelationship] = []
