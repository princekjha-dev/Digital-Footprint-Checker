"""
Deterministic exposure score calculation — NO AI, NO randomness.
Pure logic based on breach data and platform presence.
"""

from models.schemas import BreachInfo, PlatformResult, ExposureScore


# Severity weights — how much each exposed data type contributes to the score
SEVERITY_WEIGHTS: dict[str, int] = {
    "passwords": 30,
    "credit cards": 30,
    "credit card cvv": 30,
    "bank account numbers": 30,
    "passport numbers": 30,
    "aadhaar numbers": 30,
    "social security numbers": 30,
    "phone numbers": 20,
    "physical addresses": 15,
    "dates of birth": 15,
    "ip addresses": 10,
    "email addresses": 10,
    "usernames": 5,
    "names": 5,
    "genders": 3,
    "job titles": 3,
}

# Points added per public platform presence
PLATFORM_WEIGHT = 3


def _recency_multiplier(breach_date: str) -> float:
    """
    Newer breaches are more dangerous — recent data is more actionable for attackers.
    
    2022 or later → 1.5x (very recent, data likely still valid)
    2019-2021     → 1.0x (moderate age)
    Before 2019   → 0.7x (older, less actionable)
    """
    try:
        year = int(breach_date[:4])
    except (ValueError, IndexError):
        year = 2020  # Default to moderate if date is unparseable

    if year >= 2022:
        return 1.5
    elif year >= 2019:
        return 1.0
    else:
        return 0.7


def calculate_exposure_score(
    breaches: list[BreachInfo],
    platforms: list[PlatformResult],
) -> ExposureScore:
    """
    Calculate a deterministic exposure score from 0-100.
    
    Score = sum(data_type_weight * recency_multiplier for each breach) 
            + (platforms_found * PLATFORM_WEIGHT)
    
    Capped at 100. No AI, no randomness — fully explainable.
    """
    score = 0.0
    breakdown: dict[str, float] = {
        "breach_data_exposure": 0.0,
        "platform_presence": 0.0,
        "recency_impact": 0.0,
    }

    # Score from breaches
    for breach in breaches:
        multiplier = _recency_multiplier(breach.breach_date)
        breach_score = 0.0

        for data_class in breach.data_classes:
            weight = SEVERITY_WEIGHTS.get(data_class.lower(), 5)
            points = weight * multiplier
            breach_score += points

        score += breach_score
        breakdown["breach_data_exposure"] += breach_score

    # Score from platform presence
    found_platforms = [p for p in platforms if p.status == "found"]
    platform_score = len(found_platforms) * PLATFORM_WEIGHT
    score += platform_score
    breakdown["platform_presence"] = platform_score

    # Cap at 100
    final_score = min(int(score), 100)

    # Determine risk level
    if final_score <= 25:
        risk_level = "green"
        risk_label = "Low Risk"
    elif final_score <= 50:
        risk_level = "yellow"
        risk_label = "Moderate Risk"
    elif final_score <= 75:
        risk_level = "orange"
        risk_label = "High Risk"
    else:
        risk_level = "red"
        risk_label = "Critical Risk"

    return ExposureScore(
        score=final_score,
        risk_level=risk_level,
        risk_label=risk_label,
        breakdown={k: round(v, 1) for k, v in breakdown.items()},
    )
