"""PDF report generator using Jinja2 + WeasyPrint."""

import os
from jinja2 import Environment, FileSystemLoader
from models.schemas import ScanResponse

# Template directory
TEMPLATE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")


def generate_pdf(report: ScanResponse) -> bytes:
    """
    Generate a PDF report from scan results.
    
    Uses Jinja2 to render HTML template, then WeasyPrint to convert to PDF.
    No user email is included in the PDF — only breach data and recommendations.
    """
    try:
        from weasyprint import HTML
    except ImportError:
        raise RuntimeError(
            "WeasyPrint is not installed or its system dependencies are missing. "
            "Install with: pip install weasyprint"
        )

    env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))
    template = env.get_template("report.html")

    html_content = template.render(
        score=report.exposure_score,
        breaches=report.breaches,
        indian_breaches=report.indian_breaches,
        platforms=report.platforms,
        action_items=report.action_items,
        scan_timestamp=report.scan_timestamp,
        disclaimer=report.disclaimer,
        demo_mode=report.demo_mode,
    )

    pdf_bytes = HTML(string=html_content, base_url=TEMPLATE_DIR).write_pdf()
    return pdf_bytes
