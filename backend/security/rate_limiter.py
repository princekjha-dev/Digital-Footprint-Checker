"""Rate limiter configuration using SlowAPI."""

from slowapi import Limiter
from slowapi.util import get_remote_address
import time
import hashlib
from collections import defaultdict


limiter = Limiter(key_func=get_remote_address)

# ---------- Bulk Enumeration Detection ----------
# Track unique email hashes per IP in sliding 10-minute windows

_ip_email_tracker: dict[str, dict] = defaultdict(lambda: {"hashes": set(), "window_start": 0.0})
BULK_WINDOW_SECONDS = 600  # 10 minutes
BULK_THRESHOLD = 5  # max unique emails per window


def check_bulk_enumeration(ip: str, email: str) -> bool:
    """
    Returns True if this IP is suspected of bulk email enumeration.
    Tracks unique email hashes per IP within a sliding 10-minute window.
    """
    now = time.time()
    tracker = _ip_email_tracker[ip]

    # Reset window if expired
    if now - tracker["window_start"] > BULK_WINDOW_SECONDS:
        tracker["hashes"] = set()
        tracker["window_start"] = now

    email_hash = hashlib.sha256(email.encode()).hexdigest()
    tracker["hashes"].add(email_hash)

    return len(tracker["hashes"]) > BULK_THRESHOLD
