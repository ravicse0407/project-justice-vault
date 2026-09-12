import os
import sys
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Preformatted, KeepTogether
)
from reportlab.pdfgen import canvas

BASE_DIR = Path(__file__).resolve().parent
OUTPUT_PDF = BASE_DIR / "Justice_Vault_Complete_Codebase_and_Architecture.pdf"

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        canvas.Canvas.__init__(self, *args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_decorations(self, page_count):
        self.saveState()
        if self._pageNumber > 1:
            # Header
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#0b1e36"))
            self.drawString(54, 750, "JUSTICE VAULT — Evidence-Grounded AI Action Engine")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748b"))
            self.drawRightString(558, 750, "Lenovo LEAP AI Hackathon 2026")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, 744, 558, 744)

            # Footer
            self.line(54, 45, 558, 45)
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748b"))
            self.drawString(54, 32, "Confidential • Public Service Intelligence Layer (Theme 2: Digital Inclusion)")
            page_text = f"Page {self._pageNumber} of {page_count}"
            self.drawRightString(558, 32, page_text)
        self.restoreState()

def build_pdf():
    doc = SimpleDocTemplate(
        str(OUTPUT_PDF),
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom typography
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=30,
        leading=36,
        textColor=colors.HexColor('#0b1e36'),
        alignment=1, # Center
        spaceAfter=10
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=13,
        leading=18,
        textColor=colors.HexColor('#0891b2'),
        alignment=1,
        spaceAfter=25
    )

    badge_style = ParagraphStyle(
        'Badge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.white,
        alignment=1
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0b1e36'),
        spaceBefore=18,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#0891b2'),
        spaceBefore=12,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#1e293b'),
        spaceAfter=6
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7,
        leading=9,
        textColor=colors.HexColor('#0f172a')
    )

    story = []

    # ================= COVER PAGE =================
    story.append(Spacer(1, 40))
    story.append(Paragraph("JUSTICE VAULT", title_style))
    story.append(Paragraph("Evidence-Grounded AI Action Engine for Public Services & Citizen Rights", subtitle_style))
    
    badge_table = Table([[
        Paragraph("Lenovo LEAP AI Hackathon 2026 • Theme 2: Digital Inclusion & Public Access", badge_style)
    ]], colWidths=[500])
    badge_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#0b1e36')),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(badge_table)
    story.append(Spacer(1, 40))

    meta_table = Table([
        [Paragraph("<b>Core Problem</b>", body_style), Paragraph("Citizens find it difficult to understand public services due to complex information.", body_style)],
        [Paragraph("<b>Foundational Principle</b>", body_style), Paragraph("<i>'No verified evidence → no confident answer.'</i>", body_style)],
        [Paragraph("<b>Complementary Position</b>", body_style), Paragraph("Complements India.gov.in, UMANG, myScheme, and DigiLocker as a cognitive interpretation layer.", body_style)],
        [Paragraph("<b>Primary Differentiators</b>", body_style), Paragraph("Claim-Level Grounding, Cross-Source Conflict Detection, Version/Freshness Engine, Deterministic Action Checklists, Cryptographic SHA-256 Digest Verification.", body_style)],
        [Paragraph("<b>Tech Stack</b>", body_style), Paragraph("Backend: Python, FastAPI, Pydantic, ReportLab.<br/>Frontend: React 18, Vite, Tailwind CSS, Lucide Icons.", body_style)],
        [Paragraph("<b>Test Suite Status</b>", body_style), Paragraph("<b>100% Passed (7/7 Automated PyTest assertions)</b>", body_style)],
        [Paragraph("<b>Submission Date</b>", body_style), Paragraph("September 2026", body_style)],
    ], colWidths=[150, 350])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(meta_table)

    story.append(Spacer(1, 50))
    story.append(Paragraph("<b>Table of Contents</b>", h2_style))
    story.append(Paragraph("1. System Architecture & 10-Stage Pipeline (ARCHITECTURE.md)", body_style))
    story.append(Paragraph("2. 90-Second Judge Presentation Script (DEMO_SCRIPT.md)", body_style))
    story.append(Paragraph("3. Evaluation & Benchmark Framework (EVALUATION.md)", body_style))
    story.append(Paragraph("4. Security & Cryptographic Integrity Specification (SECURITY.md)", body_style))
    story.append(Paragraph("5. Knowledge Base & Rule Graph (sources.json & rule_graph.json)", body_style))
    story.append(Paragraph("6. Backend Core Source Code (FastAPI, Services, Grounding, Models)", body_style))
    story.append(Paragraph("7. Backend Automated Test Suite (test_backend.py)", body_style))
    story.append(Paragraph("8. Frontend Core Components & Pages (React, UI Components, Context)", body_style))
    
    story.append(PageBreak())

    # ================= SECTION 1: ARCHITECTURE =================
    files_to_include = [
        ("1. Architecture Specification", BASE_DIR / "docs" / "ARCHITECTURE.md", "markdown"),
        ("2. 90-Second Judge Presentation Script", BASE_DIR / "docs" / "DEMO_SCRIPT.md", "markdown"),
        ("3. Evaluation & Benchmark Framework", BASE_DIR / "docs" / "EVALUATION.md", "markdown"),
        ("4. Security & Cryptographic Specification", BASE_DIR / "docs" / "SECURITY.md", "markdown"),
        ("5. Verified Government Knowledge Base (sources.json)", BASE_DIR / "backend" / "knowledge" / "sources.json", "json"),
        ("6. Rule & Knowledge Graph (rule_graph.json)", BASE_DIR / "backend" / "knowledge" / "rule_graph.json", "json"),
        ("7. Backend: Configuration (config.py)", BASE_DIR / "backend" / "app" / "config.py", "python"),
        ("8. Backend: Pydantic Data Models (schemas.py)", BASE_DIR / "backend" / "app" / "models" / "schemas.py", "python"),
        ("9. Backend: Rule Graph Models (graph.py)", BASE_DIR / "backend" / "app" / "models" / "graph.py", "python"),
        ("10. Backend: Retrieval Engine (retrieval.py)", BASE_DIR / "backend" / "app" / "services" / "retrieval.py", "python"),
        ("11. Backend: Grounding & Evidence Attribution (grounding.py)", BASE_DIR / "backend" / "app" / "services" / "grounding.py", "python"),
        ("12. Backend: Cross-Source Conflict Detector (conflict.py)", BASE_DIR / "backend" / "app" / "services" / "conflict.py", "python"),
        ("13. Backend: Version & Freshness Engine (freshness.py)", BASE_DIR / "backend" / "app" / "services" / "freshness.py", "python"),
        ("14. Backend: Deterministic Action Engine (action_engine.py)", BASE_DIR / "backend" / "app" / "services" / "action_engine.py", "python"),
        ("15. Backend: Document AI & Extraction (document_processor.py)", BASE_DIR / "backend" / "app" / "services" / "document_processor.py", "python"),
        ("16. Backend: Security & Storage Abstraction (security.py)", BASE_DIR / "backend" / "app" / "services" / "security.py", "python"),
        ("17. Backend: Audit Logger (audit_service.py)", BASE_DIR / "backend" / "app" / "services" / "audit_service.py", "python"),
        ("18. Backend: Pluggable AI Provider (llm_provider.py)", BASE_DIR / "backend" / "app" / "services" / "llm_provider.py", "python"),
        ("19. Backend: REST API Router (router.py)", BASE_DIR / "backend" / "app" / "api" / "router.py", "python"),
        ("20. Backend: FastAPI Application Entrypoint (main.py)", BASE_DIR / "backend" / "app" / "main.py", "python"),
        ("21. Backend: Automated Test Suite (test_backend.py)", BASE_DIR / "backend" / "tests" / "test_backend.py", "python"),
        ("22. Frontend: Application Layout (App.jsx)", BASE_DIR / "frontend" / "src" / "App.jsx", "javascript"),
        ("23. Frontend: Multilingual Dictionary (translations.js)", BASE_DIR / "frontend" / "src" / "context" / "translations.js", "javascript"),
        ("24. Frontend: Global State Context (AppContext.jsx)", BASE_DIR / "frontend" / "src" / "context" / "AppContext.jsx", "javascript"),
        ("25. Frontend: Navigation Bar Component (Navbar.jsx)", BASE_DIR / "frontend" / "src" / "components" / "Navbar.jsx", "javascript"),
        ("26. Frontend: Evidence Trace Modal (EvidenceTraceModal.jsx)", BASE_DIR / "frontend" / "src" / "components" / "EvidenceTraceModal.jsx", "javascript"),
        ("27. Frontend: Conflict Alert Comparator (ConflictAlert.jsx)", BASE_DIR / "frontend" / "src" / "components" / "ConflictAlert.jsx", "javascript"),
        ("28. Frontend: Freshness Alert Component (FreshnessAlert.jsx)", BASE_DIR / "frontend" / "src" / "components" / "FreshnessAlert.jsx", "javascript"),
        ("29. Frontend: Deterministic Action Checklist (ActionChecklist.jsx)", BASE_DIR / "frontend" / "src" / "components" / "ActionChecklist.jsx", "javascript"),
        ("30. Frontend: Trust Statistics Component (TrustStats.jsx)", BASE_DIR / "frontend" / "src" / "components" / "TrustStats.jsx", "javascript"),
        ("31. Frontend: Web Speech Voice Input (VoiceInput.jsx)", BASE_DIR / "frontend" / "src" / "components" / "VoiceInput.jsx", "javascript"),
        ("32. Frontend: Confidence Badge Component (ConfidenceBadge.jsx)", BASE_DIR / "frontend" / "src" / "components" / "ConfidenceBadge.jsx", "javascript"),
        ("33. Frontend: Dashboard Page (Dashboard.jsx)", BASE_DIR / "frontend" / "src" / "pages" / "Dashboard.jsx", "javascript"),
        ("34. Frontend: Ask Justice Vault Query Page (AskVault.jsx)", BASE_DIR / "frontend" / "src" / "pages" / "AskVault.jsx", "javascript"),
        ("35. Frontend: Evidence Vault & Graph Page (EvidenceVault.jsx)", BASE_DIR / "frontend" / "src" / "pages" / "EvidenceVault.jsx", "javascript"),
        ("36. Frontend: Document Upload Page (DocumentUpload.jsx)", BASE_DIR / "frontend" / "src" / "pages" / "DocumentUpload.jsx", "javascript"),
        ("37. Frontend: Action Plans Tracker Page (ActionPlans.jsx)", BASE_DIR / "frontend" / "src" / "pages" / "ActionPlans.jsx", "javascript"),
        ("38. Frontend: Audit Trail Page (AuditTrail.jsx)", BASE_DIR / "frontend" / "src" / "pages" / "AuditTrail.jsx", "javascript"),
        ("39. Frontend: Benchmark & Evaluation Page (Benchmark.jsx)", BASE_DIR / "frontend" / "src" / "pages" / "Benchmark.jsx", "javascript"),
        ("40. Frontend: Trust Center Page (TrustCenter.jsx)", BASE_DIR / "frontend" / "src" / "pages" / "TrustCenter.jsx", "javascript"),
    ]

    for title, filepath, lang in files_to_include:
        if not filepath.exists():
            continue

        try:
            with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
        except Exception:
            continue

        story.append(Paragraph(title, h1_style))
        story.append(Paragraph(f"<b>File:</b> <font color='#0891b2'>{filepath.relative_to(BASE_DIR)}</font>", body_style))
        story.append(Spacer(1, 4))

        # Split content into manageable chunks for Preformatted blocks
        lines = content.splitlines()
        max_lines_per_block = 65
        for i in range(0, len(lines), max_lines_per_block):
            chunk = "\n".join(lines[i:i + max_lines_per_block])
            # Sanitize XML special chars for ReportLab if needed or use Preformatted
            safe_chunk = chunk.replace('\t', '  ')
            pre = Preformatted(safe_chunk, code_style)
            code_table = Table([[pre]], colWidths=[504])
            code_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
                ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
                ('TOPPADDING', (0,0), (-1,-1), 4),
                ('BOTTOMPADDING', (0,0), (-1,-1), 4),
                ('LEFTPADDING', (0,0), (-1,-1), 6),
                ('RIGHTPADDING', (0,0), (-1,-1), 6),
            ]))
            story.append(code_table)
            story.append(Spacer(1, 4))

        story.append(PageBreak())

    print(f"Building PDF with {len(files_to_include)} files...")
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated at: {OUTPUT_PDF}")

if __name__ == "__main__":
    build_pdf()
