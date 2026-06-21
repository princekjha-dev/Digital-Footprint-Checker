"""
Digital Footprint Checker — FastAPI Backend

Zero-storage, privacy-first breach detection and digital exposure scanner.
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from dotenv import load_dotenv

from security.rate_limiter import limiter
from routers import scan, report


# Load environment variables
load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle — startup and shutdown events."""
    print("[+] Digital Footprint Checker starting up...")
    demo_mode = os.getenv("DEMO_MODE", "true").lower() == "true"
    hibp_key = bool(os.getenv("HIBP_API_KEY"))
    openrouter_key = bool(os.getenv("OPENROUTER_API_KEY"))

    if demo_mode:
        print("[!] Running in DEMO MODE -- using sample breach data")
    if hibp_key:
        print("[OK] HIBP API key configured")
    else:
        print("[i] No HIBP API key -- breach checks will use demo data")
    if openrouter_key:
        print("[OK] OpenRouter API key configured -- AI explanations enabled")
    else:
        print("[i] No OpenRouter key -- using template-based explanations")

    yield

    print("[+] Digital Footprint Checker shutting down...")


app = FastAPI(
    title="Digital Footprint Checker API",
    description="Check your digital exposure — breaches, social presence, and actionable remediation.",
    version="1.0.0",
    lifespan=lifespan,
)

# --- Rate Limiting ---
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# --- CORS ---
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# --- CSP & Security Headers Middleware ---
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response: Response = await call_next(request)
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self'; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com; "
        "img-src 'self' data:; "
        "connect-src 'self'; "
        "frame-ancestors 'none'"
    )
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return response


# --- Register Routers ---
app.include_router(scan.router)
app.include_router(report.router)


# --- Health Check ---
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Digital Footprint Checker",
        "demo_mode": os.getenv("DEMO_MODE", "true").lower() == "true",
    }
