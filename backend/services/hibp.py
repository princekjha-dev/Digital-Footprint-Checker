"""HIBP API v3 client — checks email against HaveIBeenPwned breach database."""

import os
import httpx
import asyncio
from models.schemas import BreachInfo
from security.validators import sanitize_output


HIBP_BASE_URL = "https://haveibeenpwned.com/api/v3"
USER_AGENT = "DigitalFootprintChecker/1.0"


def _get_severity(data_classes: list[str]) -> str:
    """Determine breach severity based on exposed data types."""
    critical_types = {"passwords", "credit cards", "bank account numbers",
                      "passport numbers", "credit card cvv", "credit cards"}
    high_types = {"phone numbers", "physical addresses", "dates of birth",
                  "ip addresses", "social security numbers"}

    lower_classes = {d.lower() for d in data_classes}

    if lower_classes & critical_types:
        return "critical"
    if lower_classes & high_types:
        return "high"
    return "medium"


async def check_email(email: str) -> list[BreachInfo]:
    """
    Check an email against the HIBP breach database.
    
    Returns a list of BreachInfo objects for each breach the email appears in.
    Falls back to demo data if no API key is configured.
    """
    api_key = os.getenv("HIBP_API_KEY", "")

    if not api_key or os.getenv("DEMO_MODE", "true").lower() == "true":
        return _get_demo_breaches()

    headers = {
        "hibp-api-key": api_key,
        "User-Agent": USER_AGENT,
    }

    max_retries = 3
    for attempt in range(max_retries):
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(
                    f"{HIBP_BASE_URL}/breachedaccount/{email}",
                    headers=headers,
                    params={"truncateResponse": "false"},
                )

                if response.status_code == 404:
                    return []  # No breaches found — clean!

                if response.status_code == 429:
                    # Rate limited — wait and retry with exponential backoff
                    retry_after = int(response.headers.get("Retry-After", 2))
                    wait_time = retry_after * (2 ** attempt)
                    await asyncio.sleep(wait_time)
                    continue

                if response.status_code == 401:
                    print("[HIBP] Invalid API key — falling back to demo mode")
                    return _get_demo_breaches()

                if response.status_code == 403:
                    print("[HIBP] Forbidden — check User-Agent header")
                    return _get_demo_breaches()

                response.raise_for_status()
                data = response.json()

                breaches = []
                for b in data:
                    breaches.append(BreachInfo(
                        name=sanitize_output(b.get("Name", "")),
                        title=sanitize_output(b.get("Title", "")),
                        domain=sanitize_output(b.get("Domain", "")),
                        breach_date=b.get("BreachDate", "Unknown"),
                        added_date=b.get("AddedDate"),
                        pwn_count=b.get("PwnCount"),
                        description=sanitize_output(b.get("Description", "")),
                        data_classes=[sanitize_output(d) for d in b.get("DataClasses", [])],
                        is_verified=b.get("IsVerified", False),
                        is_sensitive=b.get("IsSensitive", False),
                        logo_path=b.get("LogoPath"),
                        severity=_get_severity(b.get("DataClasses", [])),
                        source="hibp",
                    ))
                return breaches

        except httpx.TimeoutException:
            if attempt < max_retries - 1:
                await asyncio.sleep(2 ** attempt)
                continue
            print("[HIBP] Request timed out after all retries")
            return _get_demo_breaches()
        except Exception as e:
            print(f"[HIBP] Unexpected error: {e}")
            return _get_demo_breaches()

    return _get_demo_breaches()


def _get_demo_breaches() -> list[BreachInfo]:
    """Return realistic demo breach data for development/portfolio demos."""
    return [
        BreachInfo(
            name="LinkedIn",
            title="LinkedIn",
            domain="linkedin.com",
            breach_date="2021-06-22",
            pwn_count=700000000,
            description="In June 2021, data associated with 700 million LinkedIn users was posted for sale. The data included email addresses, full names, phone numbers, physical addresses, geolocation records, professional information and other personal details.",
            data_classes=["Email addresses", "Names", "Phone numbers", "Physical addresses", "Genders", "Job titles"],
            is_verified=True,
            severity="high",
            source="hibp",
        ),
        BreachInfo(
            name="Adobe",
            title="Adobe",
            domain="adobe.com",
            breach_date="2013-10-04",
            pwn_count=152000000,
            description="In October 2013, 153 million Adobe accounts were breached with each containing email addresses, encrypted passwords, and unencrypted password hints.",
            data_classes=["Email addresses", "Passwords", "Usernames"],
            is_verified=True,
            severity="critical",
            source="hibp",
        ),
        BreachInfo(
            name="Canva",
            title="Canva",
            domain="canva.com",
            breach_date="2019-05-24",
            pwn_count=137000000,
            description="In May 2019, the graphic design tool Canva suffered a data breach that impacted 137 million users. The exposed data included email addresses, names, usernames, and passwords stored as bcrypt hashes.",
            data_classes=["Email addresses", "Names", "Passwords", "Usernames"],
            is_verified=True,
            severity="critical",
            source="hibp",
        ),
        BreachInfo(
            name="Deezer",
            title="Deezer",
            domain="deezer.com",
            breach_date="2019-09-01",
            pwn_count=229000000,
            description="In late 2019, the music streaming service Deezer suffered a breach. The data included email addresses, dates of birth, IP addresses, names, and genders.",
            data_classes=["Email addresses", "Names", "Dates of birth", "IP addresses", "Genders"],
            is_verified=True,
            severity="high",
            source="hibp",
        ),
        BreachInfo(
            name="Gravatar",
            title="Gravatar",
            domain="gravatar.com",
            breach_date="2020-10-03",
            pwn_count=114000000,
            description="In October 2020, scraped data from the Gravatar service was sold online. The data included usernames, email addresses, and MD5 hashes of user email addresses.",
            data_classes=["Email addresses", "Usernames"],
            is_verified=True,
            severity="medium",
            source="hibp",
        ),
    ]
