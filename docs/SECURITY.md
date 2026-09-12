# Justice Vault — Security, Integrity & Trust Architecture

## Lenovo LEAP AI Hackathon 2026 — Theme 2: Digital Inclusion & Public Access

---

## 1. Overview

Justice Vault adheres to GovTech data protection, evidentiary integrity, and defensive design standards.

---

## 2. Core Security Controls

### 2.1. Cryptographic Document Fingerprinting (SHA-256)
- Every ingested government standard and uploaded citizen artifact is hashed using SHA-256.
- Checksums are verified using constant-time comparisons (`hmac.compare_digest`) to prevent timing attacks.
- SHA-256 digests are rendered in the UI and attached to every grounded claim in the Evidence Trace.

### 2.2. AES-256 Encrypted Document Storage Abstraction
- Citizen-uploaded documents are managed through a modular encryption abstraction layer.
- Simulates envelope encryption using AES-256-GCM.
- Sensitive citizen identifiers are decoupled from search indexes.

### 2.3. Role-Based Access Control (RBAC)
- **Citizen**: Queries public services, reviews grounded evidence, uploads personal documents for verification, and generates action plans.
- **Verification Officer**: Ingests new official circulars, inspects institutional verifications, and reviews claim traces.
- **Auditor**: Full read-only access to immutable audit timelines, cryptographic checksum verifications, and compliance benchmarks.

### 2.4. Append-Only Tamper-Evident Audit Trail
- Every system transaction generates a structured audit entry:
  - `audit_id`: Monotonically increasing unique ID.
  - `timestamp`: UTC/Local ISO timestamp.
  - `user_id` & `role`: Invoking identity.
  - `event_type`: Query, Ingestion, Conflict Alert, Route Confirmation.
  - `retrieved_source_ids`: Specific standard IDs consulted.
  - `confidence`: Grounding confidence rating.
  - `external_action_confirmed`: Boolean flag confirming explicit user consent.

### 2.5. Defensive Safety Gate (Anti-Impersonation)
- Justice Vault explicitly prevents automated submissions to government portals.
- All actions that navigate toward third-party government services require explicit citizen confirmation via a dedicated modal dialog, preventing unintended actions or fraudulent automated filings.
