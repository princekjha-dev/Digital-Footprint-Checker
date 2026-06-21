"""Input validation utilities — server-side validation for all user inputs."""

import re
import html

# RFC 5322 simplified email regex — catches 99.9% of valid emails
_EMAIL_RE = re.compile(
    r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}"
    r"[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
)

_USERNAME_RE = re.compile(r"^[a-zA-Z0-9._-]{3,30}$")


def validate_email(email: str) -> str:
    """
    Validate and normalize an email address.
    
    - Strips whitespace
    - Converts to lowercase
    - Validates against RFC 5322 regex
    - Max length: 254 characters (RFC standard)
    
    Returns normalized email or raises ValueError.
    """
    if not email:
        raise ValueError("Email address is required")

    email = email.strip().lower()

    if len(email) > 254:
        raise ValueError("Email address is too long (max 254 characters)")

    if not _EMAIL_RE.match(email):
        raise ValueError("Invalid email address format")

    return email


def validate_username(username: str) -> str:
    """
    Validate and normalize a username.
    
    - Strips whitespace
    - Allows: alphanumeric, dots, underscores, hyphens
    - Length: 3-30 characters
    
    Returns normalized username or raises ValueError.
    """
    if not username:
        raise ValueError("Username is required")

    username = username.strip()

    if not _USERNAME_RE.match(username):
        raise ValueError(
            "Username must be 3-30 characters and contain only letters, numbers, dots, underscores, or hyphens"
        )

    return username


def sanitize_output(text: str) -> str:
    """
    Sanitize text for safe HTML/JSON output.
    Prevents XSS by escaping HTML entities.
    """
    if not text:
        return ""
    return html.escape(str(text), quote=True)


def validate_url(url: str) -> bool:
    """
    Validate that a URL starts with https:// and is safe to display.
    """
    if not url:
        return False
    return url.startswith("https://") and " " not in url and "<" not in url
