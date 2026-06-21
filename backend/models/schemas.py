"""Pydantic models for request/response schemas."""

from pydantic import BaseModel, Field
from typing import Optional


class ScanRequest(BaseModel):
    """Request body for the /api/scan endpoint."""
    email: str = Field(..., description="Email address to scan")
    username: Optional[str] = Field(None, description="Username to check across platforms")
    honeypot: Optional[str] = Field(None, description="Hidden honeypot field — should be empty")


class BreachInfo(BaseModel):
    """Information about a single data breach."""
    name: str
    title: str
    domain: str
    breach_date: str
    added_date: Optional[str] = None
    pwn_count: Optional[int] = None
    description: str
    data_classes: list[str] = []
    is_verified: bool = True
    is_sensitive: bool = False
    logo_path: Optional[str] = None
    severity: str = "medium"  # low, medium, critical
    source: str = "hibp"  # hibp, indian_dataset
    explanation: Optional[str] = None


class PlatformResult(BaseModel):
    """Result of checking a username on a platform."""
    platform: str
    status: str  # found, not_found, error
    url: Optional[str] = None
    icon: Optional[str] = None


class ExposureScore(BaseModel):
    """Calculated exposure score and risk level."""
    score: int = Field(..., ge=0, le=100)
    risk_level: str  # green, yellow, orange, red
    risk_label: str  # Safe, Moderate, High, Critical
    breakdown: dict = {}


class ActionItem(BaseModel):
    """A single remediation action item."""
    priority: int
    action: str
    reason: str
    category: str  # password, 2fa, privacy, monitoring


class ScanResponse(BaseModel):
    """Full scan response returned to the frontend."""
    demo_mode: bool = False
    breaches: list[BreachInfo] = []
    breach_count: int = 0
    indian_breaches: list[BreachInfo] = []
    indian_breach_count: int = 0
    platforms: list[PlatformResult] = []
    platforms_found: int = 0
    exposure_score: ExposureScore
    action_items: list[ActionItem] = []
    scan_timestamp: str
    disclaimer: str = "This report is based on publicly available breach data and public URL checks only."
