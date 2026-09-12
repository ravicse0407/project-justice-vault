from datetime import datetime
from typing import Optional, List, Dict, Any
from ..models.schemas import ActionChecklist, ActionStep, DocumentRecord

class ActionEngine:
    """
    Deterministic Action Engine for Public Services.
    Converts grounded official requirements into a structured, executable citizen checklist.
    Explicitly guards against automated submissions by enforcing client-side confirmation.
    """
    def generate_checklist(
        self,
        service_id: str,
        retrieved_docs: List[DocumentRecord],
        language: str = "en"
    ) -> Optional[ActionChecklist]:
        sid = service_id.upper()

        if "PMAY" in sid or any("PMAY" in d.id for d in retrieved_docs):
            return ActionChecklist(
                service_name="Pradhan Mantri Awas Yojana - Urban (PMAY-U 2.0)",
                steps=[
                    ActionStep(
                        step_number=1,
                        title="Verify Household Income Bracket",
                        detail="Ensure annual household income does not exceed ₹3,00,000 for EWS or ₹6,00,000 for LIG."
                    ),
                    ActionStep(
                        step_number=2,
                        title="Gather Competent Revenue & Property Certificates",
                        detail="Obtain Tehsildar-certified Income Certificate and Land Title / Patta / Possession deed."
                    ),
                    ActionStep(
                        step_number=3,
                        title="Authenticate Aadhaar & Active Bank Passbook",
                        detail="Ensure all family members' Aadhaar cards have updated biometric/OTP linkage and NPCI DBT bank account is active."
                    ),
                    ActionStep(
                        step_number=4,
                        title="Draft Pucca House Non-Ownership Affidavit",
                        detail="Prepare notarized self-declaration stating no family member owns a permanent residential pucca house anywhere in India."
                    ),
                    ActionStep(
                        step_number=5,
                        title="Submit Online at MoHUA Official Portal",
                        detail="Access the official Ministry of Housing & Urban Affairs portal and file under Citizen Assessment."
                    )
                ],
                required_documents=[
                    "Aadhaar Card of all family members",
                    "Income Certificate from Tehsildar / Competent Revenue Authority",
                    "Land Title / Patta / Property Possession Document",
                    "Aadhaar-seeded NPCI Active Bank Account Passbook",
                    "Affidavit of No Pucca House anywhere in India"
                ],
                deadline="Scheme operational for registrations through March 31, 2029",
                official_portal_url="https://pmay-urban.gov.in/",
                official_portal_name="PMAY-U 2.0 Official Citizen Portal (MoHUA)",
                requires_confirmation=True
            )

        elif "SCHOLARSHIP" in sid or any("SCHOLARSHIP" in d.id for d in retrieved_docs):
            return ActionChecklist(
                service_name="National Post-Matric Scholarship Scheme (AY 2026-27)",
                steps=[
                    ActionStep(
                        step_number=1,
                        title="Obtain Institutional Bonafide Certificate",
                        detail="Collect current year student bonafide and enrollment verification from college registrar."
                    ),
                    ActionStep(
                        step_number=2,
                        title="Verify State vs Central Portal Timeline",
                        detail="State college verification cutoff is October 31, 2026. Central NSP portal closes November 30, 2026."
                    ),
                    ActionStep(
                        step_number=3,
                        title="Upload Income & Caste Certificates",
                        detail="Ensure revenue income certificate is below ₹2.50 Lakh and community certificate is digitally signed."
                    ),
                    ActionStep(
                        step_number=4,
                        title="Lock & Submit Application on NSP",
                        detail="Submit online application on National Scholarship Portal and hand over printed slip to college desk."
                    )
                ],
                required_documents=[
                    "Aadhaar Card with active mobile link",
                    "Caste / Community Certificate",
                    "Revenue Income Certificate (< ₹2.50 Lakh)",
                    "Previous Year Academic Marksheet",
                    "Institutional Bonafide Student ID"
                ],
                deadline="October 31, 2026 (State Cutoff) / November 30, 2026 (Central NSP)",
                official_portal_url="https://scholarships.gov.in/",
                official_portal_name="National Scholarship Portal (NSP) - Official GOI Route",
                requires_confirmation=True
            )

        elif "ONORC" in sid or any("ONORC" in d.id for d in retrieved_docs):
            return ActionChecklist(
                service_name="One Nation One Ration Card (ONORC) Biometric Portability",
                steps=[
                    ActionStep(
                        step_number=1,
                        title="Locate Nearest Fair Price Shop (FPS)",
                        detail="Visit any authorized Fair Price Shop at destination city or interstate location."
                    ),
                    ActionStep(
                        step_number=2,
                        title="Provide Ration Card or Aadhaar Number",
                        detail="Present NFSA Ration Card number or registered family member Aadhaar number."
                    ),
                    ActionStep(
                        step_number=3,
                        title="Complete Biometric e-PoS Authentication",
                        detail="Authenticate via fingerprint or iris scanner on the dealer's electronic Point of Sale terminal."
                    ),
                    ActionStep(
                        step_number=4,
                        title="Receive Entitled Monthly Grains & Digital Receipt",
                        detail="No paper migration slip (Form M-1) is required. Take digital e-PoS transaction receipt."
                    )
                ],
                required_documents=[
                    "Aadhaar Card (linked to Ration Card)",
                    "NFSA Ration Card (Physical card or DigiLocker digital copy)"
                ],
                deadline="Ongoing active nationwide portability",
                official_portal_url="https://nfsa.gov.in/",
                official_portal_name="National Food Security Portal (NFSA)",
                requires_confirmation=True
            )

        elif "PMJAY" in sid or any("PMJAY" in d.id for d in retrieved_docs):
            return ActionChecklist(
                service_name="Ayushman Bharat PM-JAY (Senior Citizen 70+ Universal Cover)",
                steps=[
                    ActionStep(
                        step_number=1,
                        title="Verify Age 70+ in UIDAI Records",
                        detail="Confirm that the senior citizen's Aadhaar card reflects exact date of birth establishing age 70+."
                    ),
                    ActionStep(
                        step_number=2,
                        title="Initiate Online e-KYC on Ayushman Portal / App",
                        detail="Access the NHA beneficiary portal using registered mobile number and perform OTP/facial e-KYC."
                    ),
                    ActionStep(
                        step_number=3,
                        title="Download Ayushman Vay Vandana Card",
                        detail="Generate and download the distinct digital health card with ₹5 Lakh dedicated senior family cover."
                    )
                ],
                required_documents=[
                    "Aadhaar Card showing age 70+",
                    "Active Mobile Phone linked with Aadhaar for OTP verification"
                ],
                deadline="Continuous open enrolment under universal mandate",
                official_portal_url="https://beneficiary.nha.gov.in/",
                official_portal_name="National Health Authority (NHA) Beneficiary Portal",
                requires_confirmation=True
            )

        elif "PMKISAN" in sid or any("PMKISAN" in d.id for d in retrieved_docs):
            return ActionChecklist(
                service_name="PM Kisan Samman Nidhi (Installment Compliance)",
                steps=[
                    ActionStep(
                        step_number=1,
                        title="Complete Aadhaar Face / OTP e-KYC",
                        detail="Visit PM-Kisan portal or use PM-Kisan mobile app for facial recognition e-KYC."
                    ),
                    ActionStep(
                        step_number=2,
                        title="Verify Land Record Seeding Status",
                        detail="Check 'Know Your Status' on the portal to ensure land title is mapped by State revenue officials."
                    ),
                    ActionStep(
                        step_number=3,
                        title="Confirm NPCI Direct Benefit Transfer (DBT) Seeding",
                        detail="Verify with your bank that Aadhaar is actively linked for Aadhaar Payment Bridge (APB)."
                    )
                ],
                required_documents=[
                    "Aadhaar Card",
                    "Agricultural Land Ownership Document / Khasra Khatauni",
                    "Bank Account linked with NPCI"
                ],
                deadline="Mandatory prior to release of each 4-monthly tranche",
                official_portal_url="https://pmkisan.gov.in/",
                official_portal_name="PM-KISAN Official Government Portal",
                requires_confirmation=True
            )

        return None

action_engine = ActionEngine()
