"""In-memory cache with TTL — used for local dev. Replace with Redis for production."""

import time
import hashlib
from typing import Any


class MemoryCache:
    """Simple in-memory cache with TTL support, keyed by SHA-256 hash."""

    def __init__(self, default_ttl: int = 21600):  # 6 hours default
        self._store: dict[str, dict] = {}
        self._default_ttl = default_ttl

    def _make_key(self, email: str) -> str:
        """Generate a SHA-256 hash key from email — never store the email itself."""
        return hashlib.sha256(email.lower().strip().encode()).hexdigest()

    def get(self, email: str) -> Any | None:
        """Retrieve cached report by email. Returns None if not found or expired."""
        key = self._make_key(email)
        entry = self._store.get(key)

        if entry is None:
            return None

        if time.time() > entry["expires_at"]:
            # Hard delete expired entry
            del self._store[key]
            return None

        return entry["value"]

    def set(self, email: str, value: Any, ttl: int | None = None) -> None:
        """Cache a report keyed by SHA-256(email) with TTL."""
        key = self._make_key(email)
        self._store[key] = {
            "value": value,
            "expires_at": time.time() + (ttl or self._default_ttl),
        }

    def clear_expired(self) -> int:
        """Remove all expired entries. Returns count of removed entries."""
        now = time.time()
        expired_keys = [k for k, v in self._store.items() if now > v["expires_at"]]
        for k in expired_keys:
            del self._store[k]
        return len(expired_keys)


# Singleton instance
cache = MemoryCache()
