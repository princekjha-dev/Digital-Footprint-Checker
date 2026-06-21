"""Scan router — main endpoint for digital footprint scanning."""

import os
from datetime import datetime, timezone
from fastapi import APIRouter, Request, HTTPException
from models.schemas import ScanRequest, ScanResponse, ExposureScore
from security.validators import validate_email, validate_username
from security.rate_limiter import limiter, check_bulk_enumeration
from security.honeypot import is_bot
from cache.memory_cache import cache
from services import hibp, indian_breaches, social_scan, scoring, explanations


router = APIRouter(prefix="/api", tags=["scan"])


@router.post("/scan", response_model=ScanResponse)
@limiter.limit("10/hour")
async def scan_email(request: Request, body: ScanRequest):
    """
    Main scan endpoint — checks email against breach databases and social platforms.
    
    Flow:
    1. Validate inputs (email, username, honeypot)
    2. Check cache (keyed by SHA-256 hash of email)
    3. Check HIBP API for breaches
    4. Check Indian breach dataset
    5. Scan social platforms (if username provided)
    6. Calculate deterministic exposure score
    7. Generate explanations (AI or template)
    8. Cache and return results
    """
    # --- Step 1: Honeypot check ---
    if is_bot(body.honeypot):
        # Silently return empty result for bots
        return ScanResponse(
            demo_mode=True,
            exposure_score=ExposureScore(score=0, risk_level="green", risk_label="Low Risk"),
            scan_timestamp=datetime.now(timezone.utc).isoformat(),
        )

    # --- Step 2: Validate email ---
    try:
        email = validate_email(body.email)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    # --- Step 3: Validate username (optional) ---
    username = None
    if body.username:
        try:
            username = validate_username(body.username)
        except ValueError as e:
            raise HTTPException(status_code=422, detail=str(e))

    # --- Step 4: Bulk enumeration check ---
    client_ip = request.client.host if request.client else "unknown"
    if check_bulk_enumeration(client_ip, email):
        raise HTTPException(
            status_code=429,
            detail="Too many different emails scanned from this IP. Please try again later.",
        )

    # --- Step 5: Check cache ---
    cached_report = cache.get(email)
    if cached_report:
        return cached_report

    # --- Step 6: Run breach checks ---
    demo_mode = os.getenv("DEMO_MODE", "true").lower() == "true"

    # HIBP breach check
    hibp_breaches = await hibp.check_email(email)

    # Indian breach dataset check
    indian_breach_results = indian_breaches.check_email(email)

    # --- Step 7: Social platform scan ---
    if username:
        platform_results = await social_scan.scan_username(username)
    else:
        platform_results = social_scan.get_demo_platforms() if demo_mode else []

    # --- Step 8: Calculate exposure score (DETERMINISTIC) ---
    all_breaches = hibp_breaches + indian_breach_results
    exposure = scoring.calculate_exposure_score(all_breaches, platform_results)

    # --- Step 9: Generate explanations ---
    explained_breaches, action_items = await explanations.generate_explanations(
        all_breaches, platform_results, exposure
    )

    # Split back into HIBP and Indian breaches (preserving explanations)
    hibp_explained = [b for b in explained_breaches if b.source == "hibp"]
    indian_explained = [b for b in explained_breaches if b.source == "indian_dataset"]

    platforms_found = len([p for p in platform_results if p.status == "found"])

    # --- Step 10: Build response ---
    report = ScanResponse(
        demo_mode=demo_mode,
        breaches=hibp_explained,
        breach_count=len(hibp_explained),
        indian_breaches=indian_explained,
        indian_breach_count=len(indian_explained),
        platforms=platform_results,
        platforms_found=platforms_found,
        exposure_score=exposure,
        action_items=action_items,
        scan_timestamp=datetime.now(timezone.utc).isoformat(),
    )

    # --- Step 11: Cache result (keyed by SHA-256 hash, NOT the email) ---
    cache.set(email, report)

    return report
