import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_check():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["documents_indexed"] >= 6

def test_pmay_grounded_query():
    payload = {
        "query": "What documents do I need for PM Awas Yojana and what is the income limit?",
        "language": "en"
    }
    res = client.post("/api/query", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["confidence"] == "HIGH"
    assert data["confidence_score"] >= 0.90
    assert len(data["claims"]) > 0
    # Verify claims have verified source details
    first_claim = data["claims"][0]
    assert len(first_claim["evidence"]) > 0
    ev = first_claim["evidence"][0]
    assert ev["document_id"] == "DOC-PMAY-U2-2026"
    assert len(ev["sha256"]) == 64
    assert ev["source_url"].startswith("http")
    # Verify action checklist
    assert data["action_checklist"] is not None
    assert len(data["action_checklist"]["required_documents"]) >= 4
    assert data["action_checklist"]["requires_confirmation"] is True

def test_scholarship_conflict_detection():
    payload = {
        "query": "What is the deadline for the scholarship application?",
        "language": "en"
    }
    res = client.post("/api/query", json=payload)
    assert res.status_code == 200
    data = res.json()
    # Must trigger conflict alert
    assert data["conflict"] is not None
    assert "CONFLICT" in data["plain_language_answer"].upper() or "चेतावनी" in data["plain_language_answer"]
    assert data["evidence_status"]["no_conflict_detected"] is False
    # Confidence must be downgraded, NOT high!
    assert data["confidence"] in ["LOW", "MEDIUM"]
    assert "DOC-SCHOLARSHIP-CENTRAL-2026" in data["conflict"]["source_a"]["doc_id"]
    assert "DOC-SCHOLARSHIP-STATE-2026" in data["conflict"]["source_b"]["doc_id"]

def test_onorc_superseded_freshness():
    payload = {
        "query": "Can I use manual migration slips for One Nation One Ration Card?",
        "language": "en"
    }
    res = client.post("/api/query", json=payload)
    assert res.status_code == 200
    data = res.json()
    # Must detect superseded version
    assert data["freshness"] is not None
    assert data["freshness"]["is_outdated"] is True
    assert data["freshness"]["superseded_doc_id"] == "DOC-ONORC-2024"
    assert data["freshness"]["current_doc_id"] == "DOC-ONORC-2026"

def test_zero_hallucination_empty_retrieval():
    payload = {
        "query": "How do I register an interstellar spaceship with the municipal corporation?",
        "language": "en"
    }
    res = client.post("/api/query", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["confidence"] == "LOW"
    assert data["confidence_score"] <= 0.20
    assert data["evidence_status"]["source_verified"] is False
    assert len(data["claims"]) == 0
    assert "No verified official source was found" in data["plain_language_answer"]

def test_action_validation_and_confirmation():
    # 1. Validate checklist
    checklist_payload = {
        "checklist": {
            "service_name": "PMAY-U 2.0",
            "steps": [
                {"step_number": 1, "title": "Income", "detail": "test", "is_completed": True},
                {"step_number": 2, "title": "Aadhaar", "detail": "test", "is_completed": True}
            ],
            "required_documents": ["Aadhaar"],
            "official_portal_url": "https://pmay-urban.gov.in/",
            "official_portal_name": "PMAY Portal",
            "requires_confirmation": True
        },
        "completed_steps": [1, 2]
    }
    val_res = client.post("/api/action/validate", json=checklist_payload)
    assert val_res.status_code == 200
    assert val_res.json()["completion_percentage"] == 100.0
    assert val_res.json()["ready_for_official_route"] is True

    # 2. Confirm client-side routing
    conf_res = client.post("/api/action/confirm", json={
        "service_name": "PMAY-U 2.0",
        "official_portal_url": "https://pmay-urban.gov.in/",
        "confirmed_by_user": True,
        "timestamp": "2026-09-12 22:00:00"
    })
    assert conf_res.status_code == 200
    assert conf_res.json()["status"] == "CONFIRMED_CLIENT_SIDE_ROUTING"

def test_audit_logs():
    res = client.get("/api/audit")
    assert res.status_code == 200
    logs = res.json()
    assert len(logs) > 0
    # Verify audit record fields
    assert "audit_id" in logs[0]
    assert "timestamp" in logs[0]
    assert "event_type" in logs[0]
