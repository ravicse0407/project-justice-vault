# Justice Vault
### Evidence-Grounded AI Action Engine for Public Services & Citizen Rights

**Lenovo LEAP AI Hackathon 2026** — *Theme 2: Digital Inclusion & Public Access*

---

## 🏛️ Problem Statement
> *"Citizens find it difficult to understand public services due to complex information."*

Public scheme notifications, eligibility guidelines, and administrative circulars in India are dense, heavily fragmented across ministries, frequently updated, and prone to conflicting deadlines between Central and State authorities.

---

## ⚡ Solution: Justice Vault
Justice Vault is an **evidence-grounded public-service intelligence layer** that converts complex official gazette information into verified plain-language guidance, traceable claim attributions, version freshness warnings,
 cross-source conflict detection, and deterministic action checklists with user-confirmed official portal routing.

### Core Principle:
> **"No verified evidence → no confident answer."**

### Complementary Positioning:
Justice Vault does **NOT** replace official government platforms such as **India.gov.in**, **UMANG**, **myScheme**, or **DigiLocker**. It serves as a complementary interpretation and preparation engine. It never pretends to automatically submit government applications.

---

## 🌟 Key Differentiators

1. **Claim-Level Grounding & Evidence Trace**:
   Every factual claim is attributed to an exact issuing authority, document ID, version, effective date, section/page, retrieved legal text, official URL, and SHA-256 cryptographic hash.
2. **Cross-Source Conflict Detection**:
   When official sources disagree (e.g., Central Ministry deadline Nov 30 vs State circular cutoff Oct 31), the engine refuses to hallucinate a compromise. It flags `⚠ CONFLICT DETECTED`, downgrades confidence to LOW/MEDIUM, and instructs the citizen to verify with the authoritative institution.
3. **Version & Freshness Engine**:
   Detects superseded procedures (such as One Nation One Ration Card 2024 manual migration slips vs the active 2026 biometric e-PoS order) and warns the user about outdated rules.
4. **Deterministic Action Engine**:
   Converts verified evidence into checkable preparation checklists with a mandatory **User Confirmation Gate** before routing to official portals.
5. **Real Document Ingestion**:
   Supports PDF text extraction, OCR fallback, and SHA-256 cryptographic verification for citizen document validation.
6. **Dual Execution Mode (API Key Independent)**:
   Runs offline using the high-performance local deterministic grounding engine, or optionally connects to OpenAI GPT-4o-mini when `OPENAI_API_KEY` is provided.
7. **Multilingual & Voice Ready**:
   Seamless English and Hindi UI/explanation toggle, plus real browser Web Speech API voice input with graceful fallbacks.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+ (Python 3.14 tested and supported)
- Node.js 18+ (Node 20 tested and supported)

### 1. Clone & Configure
```bash
# Clone the repository
git clone <repo-url>
cd "lenovo project"

# Copy environment template
cp .env.example .env
```

### 2. Start the FastAPI Backend
```bash
# In the project root
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend runs at `http://127.0.0.1:8000`. Interactive API Docs are available at `http://127.0.0.1:8000/docs`.*

### 3. Start the React Frontend
```bash
# In another terminal
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

---

## 🧪 Running Automated Tests

Run the complete backend test suite:
```bash
python -m pytest backend/tests/test_backend.py -v
```
*Verifies health check, PMAY grounding, conflict detection, freshness engine, zero-hallucination defense, action validation, and audit logging.*

---

## 🎯 90-Second Judge Presentation Demo Flow

1. **Open Dashboard (`http://localhost:5173`)**:
   Notice the professional GovTech design (White background, Navy + Teal accents, Trust statistics, and clear DEMO MODE indicators).
2. **Primary Flow (Grounded Query)**:
   Click the preset chip: *"What documents do I need for PM Awas Yojana and what is the income limit?"*
   - See plain-language answer with **HIGH Confidence (96%)**.
   - Open **Evidence Trace**: Inspect claim-by-claim citations, MoHUA 2026 version, section numbers, official URL, and SHA-256 digest.
   - Inspect **Deterministic Action Checklist**: Check off items and click **"Open Official Route"** to verify the mandatory confirmation gate.
3. **Secondary Flow (Conflict Detection)**:
   Click: *"What is the deadline for the scholarship application?"*
   - See **⚠ CONFLICT DETECTED**: Central Ministry (Nov 30) vs State Directorate (Oct 31).
   - Confidence is downgraded to LOW/MEDIUM without hallucinating a resolution.
4. **Tertiary Flow (Freshness Alert)**:
   Click: *"Can I use manual migration slips for One Nation One Ration Card?"*
   - See **Older version detected**: Explains that the 2024 manual Form M-1 was superseded by the 2026 Biometric e-PoS order.
5. **Real Document Ingestion**:
   Navigate to **Documents**, upload a sample file, and see real-time SHA-256 calculation, metadata extraction, and indexing into the Evidence Vault.
6. **Audit Trail & Benchmarks**:
   Inspect the live tamper-evident **Audit Trail** and view the empirical **Benchmark Matrix**.

---

## 📁 Repository Structure
```
lenovo project/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI application entrypoint
│   │   ├── config.py                   # Environment & settings
│   │   ├── models/
│   │   │   ├── schemas.py              # Pydantic data schemas
│   │   │   └── graph.py                # Rule graph models
│   │   ├── services/
│   │   │   ├── retrieval.py            # Hybrid BM25 & semantic retriever
│   │   │   ├── grounding.py            # Claim-level evidence attribution
│   │   │   ├── freshness.py            # Version & superseded rule detector
│   │   │   ├── conflict.py             # Cross-source conflict detector
│   │   │   ├── action_engine.py        # Deterministic checklist validator
│   │   │   ├── document_processor.py   # PDF text extraction & SHA-256 hasher
│   │   │   ├── llm_provider.py         # Pluggable OpenAI & local engine
│   │   │   ├── audit_service.py        # Tamper-evident audit logger
│   │   │   └── security.py             # Cryptographic integrity & RBAC
│   │   └── api/
│   │       └── router.py               # REST API endpoints
│   ├── knowledge/
│   │   ├── sources.json                # Verified GoI seed documents
│   │   └── rule_graph.json             # Rule graph (conflicts, supersedes)
│   └── tests/
│       └── test_backend.py             # Automated pytest suite
├── frontend/
│   ├── src/
│   │   ├── components/                 # UI components (Navbar, Trace, Voice, Checklist)
│   │   ├── pages/                      # Dashboard, Ask, Vault, Upload, Audit, Benchmark
│   │   ├── context/                    # AppContext & multilingual dictionary
│   │   ├── App.jsx                     # Application layout & routing
│   │   └── index.css                   # Tailwind styles
│   ├── package.json
│   └── vite.config.js
├── docs/
│   ├── ARCHITECTURE.md                 # System architecture specification
│   ├── DEMO_SCRIPT.md                  # 90-second judge presentation script
│   ├── EVALUATION.md                   # Benchmark methodology & results
│   └── SECURITY.md                     # Cryptographic integrity & RBAC
├── .env.example
└── README.md
```

---

## 🔒 Security & Defensive Standards
- Never fabricates government APIs or automated submissions.
- SHA-256 cryptographic fingerprints on all ingested documents.
- Simulated AES-256 envelope encryption storage abstraction.
- Strict Role-Based Access Control: Citizen, Verification Officer, and Auditor.

---

## 👥 Hackathon Mentorship & Submission
- **Project**: Justice Vault
- **Hackathon**: Lenovo LEAP AI Hackathon 2026
- **Theme**: Theme 2 — Digital Inclusion & Public Access
- **Tagline**: Evidence-Grounded AI Action Engine for Public Services & Citizen Rights
