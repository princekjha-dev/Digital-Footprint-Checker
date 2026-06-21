"""Honeypot bot detection — hidden form field that humans never fill."""


def is_bot(honeypot_value: str | None) -> bool:
    """
    Returns True if the honeypot field was filled (indicating a bot).
    Real users never see or fill the hidden honeypot field.
    """
    return bool(honeypot_value and honeypot_value.strip())
