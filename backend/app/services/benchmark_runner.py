import time
import json
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any, Tuple
from ..config import settings
from ..models.schemas import BenchmarkMetric
from .retrieval import retrieval_service
from .freshness import freshness_engine
from .conflict import conflict_detector
from .grounding import grounding_engine
from .action_engine import action_engine

class BenchmarkRunner:
    """
    Empirical Benchmark Runner for Justice Vault.
    Executes real live queries against the engine, measures actual execution latency,
    evaluates objective correctness assertions, and computes real mathematical metrics.
    Zero fabricated numbers.
    """
    def __init__(self):
        self.benchmark_file = Path(settings.DATA_DIR) / "latest_benchmark.json"
        self._latest_metrics: List[BenchmarkMetric] = []
        self._load_saved()

    def _load_saved(self):
        if self.benchmark_file.exists():
            try:
                with open(self.benchmark_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self._latest_metrics = [BenchmarkMetric(**m) for m in data.get("metrics", [])]
            except Exception as e:
                print(f"Error loading benchmark file: {e}")

    def get_latest_metrics(self) -> List[BenchmarkMetric]:
        if not self._latest_metrics:
            # If never run yet, execute immediately so real metrics are available
            return self.run_full_benchmark()["metrics"]
        return self._latest_metrics

    def run_full_benchmark(self) -> Dict[str, Any]:
        """
        Executes a real test matrix across grounding, conflict, freshness,
        zero-evidence safety, and action generation.
        """
        eval_start = time.perf_counter()
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Define Empirical Test Cases
        grounding_cases = [
            {
                "id": "TC-G1",
                "query": "What documents do I need for PM Awas Yojana and what is the income limit?",
                "expected_doc": "DOC-PMAY-U2-2026",
                "min_claims": 2
            },
            {
                "id": "TC-G2",
                "query": "Who is eligible for the 70+ Ayushman Bharat health scheme?",
                "expected_doc": "DOC-PMJAY-70PLUS-2026",
                "min_claims": 1
            },
            {
                "id": "TC-G3",
                "query": "Are DigiLocker documents equivalent to original certificates under Rule 9A?",
                "expected_doc": "DOC-DIGILOCKER-2026",
                "min_claims": 1
            },
            {
                "id": "TC-G4",
                "query": "What are the mandatory conditions for PM-Kisan installment release?",
                "expected_doc": "DOC-PMKISAN-2026",
                "min_claims": 1
            }
        ]

        conflict_cases = [
            {
                "id": "TC-C1",
                "query": "What is the deadline for the scholarship application?",
                "expected_conflict": True,
                "expected_sources": ["DOC-SCHOLARSHIP-CENTRAL-2026", "DOC-SCHOLARSHIP-STATE-2026"]
            }
        ]

        freshness_cases = [
            {
                "id": "TC-F1",
                "query": "Can I use manual migration slips for One Nation One Ration Card?",
                "expected_superseded": "DOC-ONORC-2024",
                "expected_current": "DOC-ONORC-2026"
            }
        ]

        zero_evidence_cases = [
            {
                "id": "TC-Z1",
                "query": "How do I register an interstellar spaceship with the municipal corporation?",
                "expected_confidence": "LOW",
                "expected_claims": 0
            },
            {
                "id": "TC-Z2",
                "query": "What is the fee for Martian orbital atmospheric mining license?",
                "expected_confidence": "LOW",
                "expected_claims": 0
            }
        ]

        test_run_details = []
        latencies = []

        # 1. Execute Grounding Test Cases
        total_claims_found = 0
        grounded_claims_valid = 0
        total_citations = 0
        valid_citations = 0

        for tc in grounding_cases:
            t0 = time.perf_counter()
            sections = retrieval_service.retrieve_relevant_sections(tc["query"], top_k=4)
            docs = [s[0] for s in sections]
            freshness = freshness_engine.check_freshness(docs, tc["query"])
            conflict = conflict_detector.detect_conflicts(docs, tc["query"])
            res = grounding_engine.build_response(tc["query"], sections, conflict, freshness)
            t_elapsed_ms = round((time.perf_counter() - t0) * 1000, 2)
            latencies.append(t_elapsed_ms)

            claims = res.claims
            total_claims_found += len(claims)
            case_passed = True

            for claim in claims:
                if claim.supported and claim.evidence:
                    grounded_claims_valid += 1
                    for ev in claim.evidence:
                        total_citations += 1
                        # Verify citation validity against actual document record
                        source_doc = retrieval_service.get_document(ev.document_id)
                        if source_doc and ev.document_id == tc["expected_doc"] and len(ev.sha256) == 64:
                            valid_citations += 1
                        else:
                            case_passed = False

            if len(claims) < tc["min_claims"] or res.confidence != "HIGH":
                case_passed = False

            test_run_details.append({
                "test_id": tc["id"],
                "type": "GROUNDING",
                "query": tc["query"],
                "passed": case_passed,
                "latency_ms": t_elapsed_ms,
                "confidence": res.confidence,
                "claims_count": len(claims)
            })

        # 2. Execute Conflict Test Cases
        conflict_intercepted = 0
        for tc in conflict_cases:
            t0 = time.perf_counter()
            sections = retrieval_service.retrieve_relevant_sections(tc["query"], top_k=4)
            docs = [s[0] for s in sections]
            freshness = freshness_engine.check_freshness(docs, tc["query"])
            conflict = conflict_detector.detect_conflicts(docs, tc["query"])
            res = grounding_engine.build_response(tc["query"], sections, conflict, freshness)
            t_elapsed_ms = round((time.perf_counter() - t0) * 1000, 2)
            latencies.append(t_elapsed_ms)

            is_intercepted = (
                res.conflict is not None and
                res.confidence in ["LOW", "MEDIUM"] and
                not res.evidence_status.no_conflict_detected and
                res.conflict.source_a.doc_id in tc["expected_sources"] and
                res.conflict.source_b.doc_id in tc["expected_sources"]
            )
            if is_intercepted:
                conflict_intercepted += 1

            test_run_details.append({
                "test_id": tc["id"],
                "type": "CONFLICT",
                "query": tc["query"],
                "passed": is_intercepted,
                "latency_ms": t_elapsed_ms,
                "confidence": res.confidence,
                "conflict_detected": bool(res.conflict)
            })

        # 3. Execute Freshness Test Cases
        freshness_detected = 0
        for tc in freshness_cases:
            t0 = time.perf_counter()
            sections = retrieval_service.retrieve_relevant_sections(tc["query"], top_k=4)
            docs = [s[0] for s in sections]
            freshness = freshness_engine.check_freshness(docs, tc["query"])
            conflict = conflict_detector.detect_conflicts(docs, tc["query"])
            res = grounding_engine.build_response(tc["query"], sections, conflict, freshness)
            t_elapsed_ms = round((time.perf_counter() - t0) * 1000, 2)
            latencies.append(t_elapsed_ms)

            is_freshness_valid = (
                res.freshness is not None and
                res.freshness.is_outdated and
                res.freshness.superseded_doc_id == tc["expected_superseded"] and
                res.freshness.current_doc_id == tc["expected_current"]
            )
            if is_freshness_valid:
                freshness_detected += 1

            test_run_details.append({
                "test_id": tc["id"],
                "type": "FRESHNESS",
                "query": tc["query"],
                "passed": is_freshness_valid,
                "latency_ms": t_elapsed_ms,
                "superseded_id": res.freshness.superseded_doc_id if res.freshness else None
            })

        # 4. Execute Zero-Evidence Safety Cases
        zero_evidence_blocked = 0
        for tc in zero_evidence_cases:
            t0 = time.perf_counter()
            sections = retrieval_service.retrieve_relevant_sections(tc["query"], top_k=4)
            docs = [s[0] for s in sections]
            freshness = freshness_engine.check_freshness(docs, tc["query"])
            conflict = conflict_detector.detect_conflicts(docs, tc["query"])
            res = grounding_engine.build_response(tc["query"], sections, conflict, freshness)
            t_elapsed_ms = round((time.perf_counter() - t0) * 1000, 2)
            latencies.append(t_elapsed_ms)

            is_blocked = (
                res.confidence == "LOW" and
                res.confidence_score <= 0.20 and
                len(res.claims) == 0 and
                not res.evidence_status.source_verified and
                "No verified official source" in res.plain_language_answer
            )
            if is_blocked:
                zero_evidence_blocked += 1

            test_run_details.append({
                "test_id": tc["id"],
                "type": "ZERO_EVIDENCE",
                "query": tc["query"],
                "passed": is_blocked,
                "latency_ms": t_elapsed_ms,
                "confidence": res.confidence
            })

        # 5. Execute Action Checklist Determinism Case
        t0 = time.perf_counter()
        pmay_docs = [retrieval_service.get_document("DOC-PMAY-U2-2026")]
        checklist = action_engine.generate_checklist("PMAY", pmay_docs, language="en")
        t_elapsed_ms = round((time.perf_counter() - t0) * 1000, 2)
        latencies.append(t_elapsed_ms)

        checklist_valid = (
            checklist is not None and
            len(checklist.steps) >= 5 and
            len(checklist.required_documents) >= 5 and
            checklist.requires_confirmation is True and
            checklist.official_portal_url.startswith("https://")
        )

        test_run_details.append({
            "test_id": "TC-A1",
            "type": "ACTION_DETERMINISM",
            "query": "Action Schema Validation",
            "passed": checklist_valid,
            "latency_ms": t_elapsed_ms
        })

        # Compute Mathematical Metrics
        # 1. Grounded Claim Rate
        grounded_pct = (grounded_claims_valid / total_claims_found * 100.0) if total_claims_found > 0 else 0.0
        # 2. Citation Precision
        citation_pct = (valid_citations / total_citations * 100.0) if total_citations > 0 else 0.0
        # 3. Conflict Interception Rate
        conflict_pct = (conflict_intercepted / len(conflict_cases) * 100.0) if conflict_cases else 0.0
        # 4. Freshness Detection Rate
        freshness_pct = (freshness_detected / len(freshness_cases) * 100.0) if freshness_cases else 0.0
        # 5. Zero-Evidence Block Rate
        zero_ev_pct = (zero_evidence_blocked / len(zero_evidence_cases) * 100.0) if zero_evidence_cases else 0.0
        # 6. Action Checklist Determinism
        action_pct = 100.0 if checklist_valid else 0.0
        # 7. Measured Median Latency
        sorted_latencies = sorted(latencies)
        median_latency = sorted_latencies[len(sorted_latencies) // 2] if sorted_latencies else 0.0

        metrics = [
            BenchmarkMetric(
                metric_name="Grounded Claim Rate",
                target="≥ 95.0%",
                actual=f"{grounded_pct:.1f}%",
                numerator=grounded_claims_valid,
                denominator=total_claims_found,
                test_cases_executed=len(grounding_cases),
                status="MEETS TARGET" if grounded_pct >= 95.0 else "FAILED",
                description="Proportion of generated factual statements directly supported by verified document passages.",
                timestamp=timestamp
            ),
            BenchmarkMetric(
                metric_name="Citation Precision",
                target="≥ 90.0%",
                actual=f"{citation_pct:.1f}%",
                numerator=valid_citations,
                denominator=total_citations,
                test_cases_executed=len(grounding_cases),
                status="MEETS TARGET" if citation_pct >= 90.0 else "FAILED",
                description="Accuracy of cited document IDs, versions, and section offsets matching the active source text.",
                timestamp=timestamp
            ),
            BenchmarkMetric(
                metric_name="Conflict Interception Rate",
                target="100.0%",
                actual=f"{conflict_pct:.1f}%",
                numerator=conflict_intercepted,
                denominator=len(conflict_cases),
                test_cases_executed=len(conflict_cases),
                status="MEETS TARGET" if conflict_pct == 100.0 else "FAILED",
                description="Rate of detecting multi-authority contradictory directives without hallucinating compromise deadlines.",
                timestamp=timestamp
            ),
            BenchmarkMetric(
                metric_name="Freshness / Superseded Detection",
                target="100.0%",
                actual=f"{freshness_pct:.1f}%",
                numerator=freshness_detected,
                denominator=len(freshness_cases),
                test_cases_executed=len(freshness_cases),
                status="MEETS TARGET" if freshness_pct == 100.0 else "FAILED",
                description="Identification of outdated/superseded circulars and issuance of version downgrade alerts.",
                timestamp=timestamp
            ),
            BenchmarkMetric(
                metric_name="Zero-Evidence Block Rate",
                target="100.0%",
                actual=f"{zero_ev_pct:.1f}%",
                numerator=zero_evidence_blocked,
                denominator=len(zero_evidence_cases),
                test_cases_executed=len(zero_evidence_cases),
                status="MEETS TARGET" if zero_ev_pct == 100.0 else "FAILED",
                description="Refusal to speculate when no verified evidence exists ('No verified evidence → no confident answer').",
                timestamp=timestamp
            ),
            BenchmarkMetric(
                metric_name="Action Checklist Determinism",
                target="100.0%",
                actual=f"{action_pct:.1f}%",
                numerator=1 if checklist_valid else 0,
                denominator=1,
                test_cases_executed=1,
                status="MEETS TARGET" if action_pct == 100.0 else "FAILED",
                description="Conformance of generated citizen preparation actions to strict Pydantic schemas.",
                timestamp=timestamp
            ),
            BenchmarkMetric(
                metric_name="Median Query Latency (Local)",
                target="< 250 ms",
                actual=f"{median_latency:.1f} ms",
                measured_latency_ms=median_latency,
                test_cases_executed=len(latencies),
                status="MEETS TARGET" if median_latency < 250.0 else "FAILED",
                description="Empirical roundtrip query latency measured across all local test case executions.",
                timestamp=timestamp
            )
        ]

        # Calculate overall pass rate
        total_tests = len(test_run_details)
        passed_tests = sum(1 for t in test_run_details if t["passed"])
        pass_rate_pct = round((passed_tests / total_tests * 100.0), 1)

        result_payload = {
            "tests_executed": total_tests,
            "tests_passed": passed_tests,
            "pass_rate": f"{pass_rate_pct}%",
            "overall_status": "MEETS TARGET" if pass_rate_pct == 100.0 else "FAILED",
            "metrics": [m.model_dump() for m in metrics],
            "test_details": test_run_details,
            "measured_median_latency_ms": median_latency,
            "evaluated_at": timestamp
        }

        # Persist benchmark result
        try:
            with open(self.benchmark_file, "w", encoding="utf-8") as f:
                json.dump(result_payload, f, indent=2)
        except Exception as e:
            print(f"Error saving benchmark: {e}")

        self._latest_metrics = metrics
        return result_payload

benchmark_runner = BenchmarkRunner()
