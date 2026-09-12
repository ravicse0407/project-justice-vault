import hashlib
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.services.audit_service import audit_service
from backend.app.services.benchmark_runner import benchmark_runner

client = TestClient(app)

def test_health_check():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["documents_indexed"] >= 6
    assert data["audit_chain_intact"] is True

def test_1_pmay_grounded_query():
    payload = {
        "query": "What documents do I need for PM Awas Yojana and what is the income limit?",
        "language": "en"
    }
    res = client.post("/api/query", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["confidence"] == "HIGH"
    assert data["confidence_score"] >= 0.85
    assert len(data["claims"]) > 0
    # Verify claims have verified source details
    first_claim = data["claims"][0]
    assert len(first_claim["evidence"]) > 0
    ev = first_claim["evidence"][0]
    assert ev["document_id"] == "DOC-PMAY-U2-2026"
    assert len(ev["sha256"]) == 64
    assert ev["source_url"].startswith("https://")
    # Verify action checklist
    assert data["action_checklist"] is not None
    assert len(data["action_checklist"]["required_documents"]) >= 4
    assert data["action_checklist"]["requires_confirmation"] is True
    assert data["action_checklist"]["official_portal_url"] == "https://pmay-urban.gov.in/"

def test_2_scholarship_conflict_detection():
    payload = {
        "query": "What is the deadline for the scholarship application?",
        "language": "en"
    }
    res = client.post("/api/query", json=payload)
    assert res.status_code == 200
    data = res.json()
    # Must trigger conflict alert
    assert data["conflict"] is not None
    assert "CONFLICT" in data["plain_language_answer"].upper()
    assert data["evidence_status"]["no_conflict_detected"] is False
    # Confidence must be downgraded, NOT high!
    assert data["confidence"] in ["LOW", "MEDIUM"]
    assert data["confidence_score"] <= 0.60
    assert "DOC-SCHOLARSHIP-CENTRAL-2026" in data["conflict"]["source_a"]["doc_id"]
    assert "DOC-SCHOLARSHIP-STATE-2026" in data["conflict"]["source_b"]["doc_id"]
    assert "2026-11-30" in data["conflict"]["source_a"]["deadline"]
    assert "2026-10-31" in data["conflict"]["source_b"]["deadline"]
    # Verify no compromise deadline is synthesized
    assert data["conflict"]["recommended_action"] is not None

def test_3_onorc_superseded_freshness():
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
    assert "biometric" in data["plain_language_answer"].lower() or "e-pos" in data["plain_language_answer"].lower()

def test_4_ayushman_70plus_grounding():
    payload = {
        "query": "Who is eligible for the 70+ Ayushman Bharat health scheme?",
        "language": "en"
    }
    res = client.post("/api/query", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["confidence"] == "HIGH"
    assert len(data["claims"]) > 0
    ev = data["claims"][0]["evidence"][0]
    assert ev["document_id"] == "DOC-PMJAY-70PLUS-2026"
    assert data["action_checklist"] is not None
    assert data["action_checklist"]["official_portal_url"] == "https://beneficiary.nha.gov.in/"

def test_5_zero_evidence_refusal():
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

def test_6_document_upload_and_sha256_verification():
    sample_content = b"OFFICE OF THE TEHSILDAR: Income Certificate Rs 2,20,000 for PMAY-U 2.0 beneficiary family."
    expected_hash = hashlib.sha256(sample_content).hexdigest()

    files = {"file": ("citizen_tehsildar_income_cert.txt", sample_content, "text/plain")}
    res = client.post("/api/documents/upload", files=files)
    assert res.status_code == 200
    data = res.json()
    assert data["sha256"] == expected_hash
    assert data["document_id"].startswith("DOC-USER-")
    assert "Housing" in data["classified_service"]

    # Verify document is retrievable by ID
    get_res = client.get(f"/api/documents/{data['document_id']}")
    assert get_res.status_code == 200
    assert get_res.json()["sha256"] == expected_hash

def test_7_action_validation_and_confirmation_gate():
    # 1. Validation test
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

    # 2. Confirmation gate requires explicit user confirmation
    conf_res = client.post("/api/action/confirm", json={
        "service_name": "PMAY-U 2.0",
        "official_portal_url": "https://pmay-urban.gov.in/",
        "confirmed_by_user": True,
        "timestamp": "2026-09-12 22:00:00"
    })
    assert conf_res.status_code == 200
    assert conf_res.json()["status"] == "CONFIRMED_CLIENT_SIDE_ROUTING"
    assert "https://pmay-urban.gov.in/" in conf_res.json()["portal_url"]

def test_8_cryptographic_hash_chain_integrity():
    # Verify the entire audit trail's hash chain
    is_valid, count, msg = audit_service.verify_chain_integrity()
    assert is_valid is True
    assert count > 0

    # Test via API endpoint
    verify_res = client.post("/api/audit/verify")
    assert verify_res.status_code == 200
    v_data = verify_res.json()
    assert v_data["is_valid"] is True
    assert v_data["verified_blocks"] >= count

def test_9_real_empirical_benchmark_execution():
    # Run the live benchmark matrix
    res = client.post("/api/evaluate")
    assert res.status_code == 200
    data = res.json()
    assert data["tests_executed"] >= 8
    assert data["tests_passed"] == data["tests_executed"]
    assert data["pass_rate"] == "100.0%" or data["pass_rate"] == "100%"
    assert data["overall_status"] == "MEETS TARGET"
    assert data["measured_median_latency_ms"] > 0
    assert len(data["metrics"]) >= 6

    # Verify GET /api/benchmark returns real calculated metrics
    b_res = client.get("/api/benchmark")
    assert b_res.status_code == 200
    metrics = b_res.json()
    assert len(metrics) >= 6
    # Verify Grounded Claim Rate has real numerator and denominator
    grounding_metric = next(m for m in metrics if m["metric_name"] == "Grounded Claim Rate")
    assert grounding_metric["numerator"] is not None
    assert grounding_metric["denominator"] is not None
    assert grounding_metric["status"] == "MEETS TARGET"
