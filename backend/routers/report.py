"""Report router — PDF report generation endpoint."""

from fastapi import APIRouter, HTTPException, Response
from models.schemas import ScanResponse


router = APIRouter(prefix="/api", tags=["report"])


@router.post("/report/pdf")
async def generate_pdf_report(body: ScanResponse):
    """
    Generate a downloadable PDF report from scan results.
    
    Accepts the full ScanResponse JSON and renders it as a styled PDF.
    No email address is included in the PDF — only breach data and recommendations.
    """
    try:
        from services.pdf_generator import generate_pdf
        pdf_bytes = generate_pdf(body)

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": 'attachment; filename="digital-footprint-report.pdf"',
                "Cache-Control": "no-store",
            },
        )
    except RuntimeError as e:
        raise HTTPException(
            status_code=503,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate PDF report: {str(e)}",
        )
