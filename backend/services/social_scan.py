"""Social footprint scanner — checks username presence across public platforms."""

import httpx
import asyncio
from models.schemas import PlatformResult


# Platform definitions: name, URL template, expected status for "found"
PLATFORMS = [
    {"name": "GitHub", "url": "https://github.com/{username}", "icon": "github"},
    {"name": "Twitter / X", "url": "https://x.com/{username}", "icon": "twitter"},
    {"name": "Instagram", "url": "https://www.instagram.com/{username}/", "icon": "instagram"},
    {"name": "Reddit", "url": "https://www.reddit.com/user/{username}", "icon": "reddit"},
    {"name": "LinkedIn", "url": "https://www.linkedin.com/in/{username}", "icon": "linkedin"},
    {"name": "Dev.to", "url": "https://dev.to/{username}", "icon": "devto"},
    {"name": "Medium", "url": "https://medium.com/@{username}", "icon": "medium"},
    {"name": "Pinterest", "url": "https://www.pinterest.com/{username}/", "icon": "pinterest"},
    {"name": "YouTube", "url": "https://www.youtube.com/@{username}", "icon": "youtube"},
    {"name": "Quora", "url": "https://www.quora.com/profile/{username}", "icon": "quora"},
]

USER_AGENT = "DigitalFootprintChecker/1.0"
TIMEOUT = 5.0  # seconds per request
MAX_CONCURRENT = 5


async def _check_platform(
    client: httpx.AsyncClient,
    platform: dict,
    username: str,
    semaphore: asyncio.Semaphore,
) -> PlatformResult:
    """Check a single platform for the given username."""
    url = platform["url"].format(username=username)

    async with semaphore:
        try:
            response = await client.get(
                url,
                follow_redirects=True,
                timeout=TIMEOUT,
            )

            if response.status_code == 200:
                return PlatformResult(
                    platform=platform["name"],
                    status="found",
                    url=url,
                    icon=platform["icon"],
                )
            elif response.status_code == 404:
                return PlatformResult(
                    platform=platform["name"],
                    status="not_found",
                    url=None,
                    icon=platform["icon"],
                )
            else:
                return PlatformResult(
                    platform=platform["name"],
                    status="error",
                    url=None,
                    icon=platform["icon"],
                )

        except (httpx.TimeoutException, httpx.ConnectError, httpx.HTTPError):
            return PlatformResult(
                platform=platform["name"],
                status="error",
                url=None,
                icon=platform["icon"],
            )


async def scan_username(username: str) -> list[PlatformResult]:
    """
    Check a username across all configured platforms concurrently.
    
    Uses a semaphore to limit concurrent requests (max 5 at once).
    Returns results for all platforms with status: found, not_found, or error.
    """
    semaphore = asyncio.Semaphore(MAX_CONCURRENT)

    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
    }

    async with httpx.AsyncClient(headers=headers) as client:
        tasks = [
            _check_platform(client, platform, username, semaphore)
            for platform in PLATFORMS
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)

    # Convert any exceptions to error results
    final_results = []
    for i, result in enumerate(results):
        if isinstance(result, Exception):
            final_results.append(PlatformResult(
                platform=PLATFORMS[i]["name"],
                status="error",
                url=None,
                icon=PLATFORMS[i]["icon"],
            ))
        else:
            final_results.append(result)

    return final_results


def get_demo_platforms() -> list[PlatformResult]:
    """Return demo platform results for when no username is provided or in demo mode."""
    return [
        PlatformResult(platform="GitHub", status="found", url="https://github.com/demouser", icon="github"),
        PlatformResult(platform="Twitter / X", status="found", url="https://x.com/demouser", icon="twitter"),
        PlatformResult(platform="Instagram", status="not_found", url=None, icon="instagram"),
        PlatformResult(platform="Reddit", status="found", url="https://www.reddit.com/user/demouser", icon="reddit"),
        PlatformResult(platform="LinkedIn", status="found", url="https://www.linkedin.com/in/demouser", icon="linkedin"),
        PlatformResult(platform="Dev.to", status="not_found", url=None, icon="devto"),
        PlatformResult(platform="Medium", status="not_found", url=None, icon="medium"),
        PlatformResult(platform="Pinterest", status="not_found", url=None, icon="pinterest"),
        PlatformResult(platform="YouTube", status="found", url="https://www.youtube.com/@demouser", icon="youtube"),
        PlatformResult(platform="Quora", status="error", url=None, icon="quora"),
    ]
