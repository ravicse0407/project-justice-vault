# Justice Vault — System Architecture Specification

## Lenovo LEAP AI Hackathon 2026 — Theme 2: Digital Inclusion & Public Access

---

## 1. Executive Summary & Design Philosophy

**Justice Vault** is an evidence-grounded public-service intelligence layer that converts dense, fragmented administrative notifications, gazettes, and guidelines into verified, plain-language citizen guidance and deterministic action plans.

### Foundational Principle:
> **"No verified evidence → no confident answer."**

### Complementary Positioning:
Justice Vault does **not** replace official Government of India citizen-facing infrastructure (such as **India.gov.in**, **UMANG**, **myScheme**, or **DigiLocker**). Instead, it operates as a complementary cognitive interpretation layer that:
1. Translates complex bureaucratic legalese into plain language.
2. Cross-references versions to flag superseded regulations.
3. Detects inter-authority conflicts between Central and State circulars.
4. Generates step-by-step preparation checklists with mandatory user confirmation gates.

---

## 2. End-to-End 10-Stage Pipeline Architecture

```
Citizen Query / Document
       ↓
Stage 1: Intent & Entity Classification
       ↓
Stage 2: Official Evidence Retrieval (Hybrid BM25 & Semantic)
       ↓
Stage 3: Document & Section Understanding
       ↓
Stage 4: Version & Freshness Check (Superseded Detection)
       ↓
Stage 5: Cross-Source Conflict Detection (Central vs State)
       ↓
Stage 6: Claim-Level Grounding & Attribution
       ↓
Stage 7: Confidence Gate (HIGH / MEDIUM / LOW)
       ↓
Stage 8: Plain-Language Explanation Synthesis (English / Hindi)
       ↓
Stage 9: Deterministic Action Checklist Engine
       ↓
Stage 10: Client-Side Verified Official Portal Route
```

---

## 3. Core Component Breakdown

### 3.1. Evidence Vault & Knowledge Base
- Ingests verified official standards from ministries (MoHUA, MeitY, NHA, Consumer Affairs, Agriculture).
- Every record maintains:
  - `document_id`: Unique identifier (e.g., `DOC-PMAY-U2-2026`).
  - `version`: Version string (e.g., `2026.1`).
  - `issuer`: Authoritative issuing body.
  - `publication_date` & `effective_date`.
  - `status`: `CURRENT` or `SUPERSEDED`.
  - `sha256`: Cryptographic digest computed over the raw legal text.
  - `source_url`: Official government portal URL.

### 3.2. Hybrid Semantic & BM25 Retrieval Engine
- Fast tokenization and normalization with domain keyword boundary matching (`\b`).
- Eliminates substring false-positives while boosting queries matching verified service domains.
- Retrieves specific document sections with page numbers and raw text passages.

### 3.3. Version & Freshness Engine
- Tracks superseded relationships in the Rule Graph (`RULE_SUPERSEDES`).
- Intercepts queries referencing outdated mechanisms (e.g., ONORC 2024 manual Form M-1 migration slips) and warns citizens that 2026 orders have mandated 100% biometric e-PoS transactions.

### 3.4. Cross-Source Conflict Detection Engine
- Inspects multi-authority circulars governing the same topic (`RULE_CONFLICTS`).
- Example: Central Ministry scholarship deadline (November 30) vs State Higher Education collegiate verification cutoff (October 31).
- Downgrades confidence to `LOW` or `MEDIUM` and renders a side-by-side comparator instead of synthesizing a hallucinated compromise.

### 3.5. Claim-Level Grounding Engine
- Formulates discrete atomic claims.
- Attributes each claim to an exact document, version, section, page, and SHA-256 hash.
- Renders the full evidentiary lineage in the interactive **Evidence Trace** UI.

### 3.6. Deterministic Action Engine
- Translates legal prerequisites into checkable preparation tasks.
- Validates required documents.
- Protects citizens via a strict **User Confirmation Gate**: Justice Vault never automatically submits applications or signs documents on a citizen's behalf.

---

## 4. Security & Cryptographic Integrity

1. **SHA-256 Checksums**: Every document is hashed upon upload to guarantee tamper evidence.
2. **AES-256 Storage Abstraction**: Encrypted storage envelope preview separating digests from binary content.
3. **Role-Based Access Control (RBAC)**: Distinct permissions for Citizen, Verification Officer, and Auditor.
4. **Append-Only Tamper-Evident Audit Trail**: Every query, retrieval, conflict intercept, and portal launch is logged with microsecond timestamps and immutable event IDs.
