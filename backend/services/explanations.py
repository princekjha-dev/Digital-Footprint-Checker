"""
AI explanation generator + template fallback.
Uses OpenRouter API for natural language explanations of breach data.
Falls back to template-based explanations when no API key is available.
"""

import os
import httpx
from models.schemas import BreachInfo, PlatformResult, ActionItem, ExposureScore


OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# Anti-hallucination system prompt — strictly grounded in provided data
SYSTEM_PROMPT = """You are a cybersecurity advisor explaining data breach impacts to non-technical users.

STRICT RULES:
1. ONLY explain breaches that are provided in the data below. Never mention breaches not listed.
2. NEVER suggest the user "might also be exposed" in breaches not in the data.
3. NEVER invent statistics like "millions of people were affected" unless the pwn_count is provided.
4. Plain English explanations must accurately reflect what data was ACTUALLY exposed.
5. If a breach's impact is unclear from the metadata, say "the full extent of this breach is unclear."
6. Action items must be specific and actionable — never generic filler like "be careful online."
7. Keep explanations concise — 1-2 sentences per breach.
8. Use simple, non-technical language. Imagine explaining to your grandmother.
9. Focus on REAL risks: what could an attacker DO with this specific data?

Respond ONLY in valid JSON format as specified."""


async def generate_explanations(
    breaches: list[BreachInfo],
    platforms: list[PlatformResult],
    score: ExposureScore,
) -> tuple[list[BreachInfo], list[ActionItem]]:
    """
    Generate plain-English explanations and action items.
    Uses AI if OpenRouter key is available, otherwise uses templates.
    
    Returns (updated breaches with explanations, action items list).
    """
    api_key = os.getenv("OPENROUTER_API_KEY", "")

    if api_key:
        try:
            return await _ai_generate(breaches, platforms, score, api_key)
        except Exception as e:
            print(f"[Explanations] AI generation failed, falling back to templates: {e}")

    # Fallback to template-based explanations
    return _template_generate(breaches, platforms, score)


async def _ai_generate(
    breaches: list[BreachInfo],
    platforms: list[PlatformResult],
    score: ExposureScore,
    api_key: str,
) -> tuple[list[BreachInfo], list[ActionItem]]:
    """Generate explanations using OpenRouter API."""

    breach_data = []
    for b in breaches:
        breach_data.append({
            "name": b.name,
            "date": b.breach_date,
            "data_exposed": b.data_classes,
            "severity": b.severity,
            "pwn_count": b.pwn_count,
        })

    platform_data = [{"name": p.platform, "status": p.status} for p in platforms]

    user_prompt = f"""Based on ONLY the following breach and platform data, generate:
1. A plain-English explanation for each breach (1-2 sentences, simple language)
2. A prioritized action plan (max 6 items)

BREACH DATA:
{breach_data}

PLATFORM DATA:
{platform_data}

EXPOSURE SCORE: {score.score}/100 ({score.risk_label})

Respond in this exact JSON format:
{{
    "explanations": {{
        "<breach_name>": "<explanation>"
    }},
    "actions": [
        {{"priority": 1, "action": "<what to do>", "reason": "<why>", "category": "<password|2fa|privacy|monitoring>"}}
    ]
}}"""

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "anthropic/claude-3.5-sonnet",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.3,  # Low temp for factual accuracy
        "max_tokens": 2000,
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(OPENROUTER_URL, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()

    content = data["choices"][0]["message"]["content"]

    # Parse JSON from response (handle markdown code blocks)
    import json
    if "```json" in content:
        content = content.split("```json")[1].split("```")[0]
    elif "```" in content:
        content = content.split("```")[1].split("```")[0]

    result = json.loads(content.strip())

    # Update breaches with AI explanations
    explanations = result.get("explanations", {})
    for breach in breaches:
        if breach.name in explanations:
            breach.explanation = explanations[breach.name]

    # Parse action items
    actions = []
    for item in result.get("actions", []):
        actions.append(ActionItem(
            priority=item.get("priority", 99),
            action=item.get("action", ""),
            reason=item.get("reason", ""),
            category=item.get("category", "monitoring"),
        ))

    return breaches, actions


def _template_generate(
    breaches: list[BreachInfo],
    platforms: list[PlatformResult],
    score: ExposureScore,
) -> tuple[list[BreachInfo], list[ActionItem]]:
    """Generate explanations using templates when AI is unavailable."""

    # Generate breach explanations from templates
    for breach in breaches:
        breach.explanation = _make_breach_explanation(breach)

    # Generate action items
    actions = _make_action_items(breaches, platforms, score)

    return breaches, actions


def _make_breach_explanation(breach: BreachInfo) -> str:
    """Create a template-based plain-English explanation for a breach."""
    data_types = [d.lower() for d in breach.data_classes]
    year = breach.breach_date[:4] if breach.breach_date else "Unknown year"

    # Determine what was exposed in plain language
    exposed_items = []
    risk_items = []

    if any("password" in d for d in data_types):
        exposed_items.append("passwords")
        risk_items.append("Attackers may try these passwords on your other accounts")
    if any("phone" in d for d in data_types):
        exposed_items.append("phone numbers")
        risk_items.append("You may receive spam calls or phishing SMS messages")
    if any("address" in d for d in data_types):
        exposed_items.append("physical addresses")
        risk_items.append("Your location data could be used for targeted scams")
    if any("credit" in d for d in data_types):
        exposed_items.append("credit card data")
        risk_items.append("Monitor your bank statements for unauthorized transactions")
    if any("passport" in d for d in data_types):
        exposed_items.append("passport details")
        risk_items.append("Your identity documents could be used for fraud")
    if any("aadhaar" in d for d in data_types):
        exposed_items.append("Aadhaar numbers")
        risk_items.append("Your Aadhaar could be misused for identity fraud")
    if any("email" in d for d in data_types):
        exposed_items.append("email addresses")
    if any("name" in d for d in data_types):
        exposed_items.append("names")
    if any("date" in d or "birth" in d for d in data_types):
        exposed_items.append("dates of birth")

    exposed_text = ", ".join(exposed_items[:4]) if exposed_items else "personal data"
    risk_text = risk_items[0] if risk_items else "This data could be used for targeted phishing"

    count_text = ""
    if breach.pwn_count and breach.pwn_count > 0:
        if breach.pwn_count >= 1_000_000:
            count_text = f" affecting {breach.pwn_count // 1_000_000}M+ users"
        else:
            count_text = f" affecting {breach.pwn_count:,} users"

    return (
        f"In {year}, {breach.title} was breached{count_text}. "
        f"Your {exposed_text} may have been exposed. {risk_text}."
    )


def _make_action_items(
    breaches: list[BreachInfo],
    platforms: list[PlatformResult],
    score: ExposureScore,
) -> list[ActionItem]:
    """Generate prioritized action items based on scan results."""
    actions: list[ActionItem] = []
    priority = 1

    # Check for password breaches
    password_breaches = [
        b.name for b in breaches
        if any("password" in d.lower() for d in b.data_classes)
    ]
    if password_breaches:
        sites = ", ".join(password_breaches[:3])
        actions.append(ActionItem(
            priority=priority,
            action=f"Change your password immediately on: {sites}",
            reason=f"Your password was exposed in {len(password_breaches)} breach(es). If you reuse passwords, change them on all sites.",
            category="password",
        ))
        priority += 1

    # Check for email breaches (enable 2FA)
    email_breaches = [b for b in breaches if any("email" in d.lower() for d in b.data_classes)]
    if len(email_breaches) >= 2:
        actions.append(ActionItem(
            priority=priority,
            action="Enable two-factor authentication (2FA) on your email account",
            reason=f"Your email appeared in {len(email_breaches)} breaches. 2FA adds a critical extra layer of security.",
            category="2fa",
        ))
        priority += 1

    # Check for financial data
    financial_breaches = [
        b.name for b in breaches
        if any(d.lower() in ["credit cards", "bank account numbers", "credit card cvv"] for d in b.data_classes)
    ]
    if financial_breaches:
        actions.append(ActionItem(
            priority=priority,
            action="Monitor your bank and credit card statements for unauthorized transactions",
            reason=f"Financial data was exposed in the {', '.join(financial_breaches[:2])} breach(es).",
            category="monitoring",
        ))
        priority += 1

    # Check for identity data
    identity_breaches = [
        b.name for b in breaches
        if any(d.lower() in ["passport numbers", "aadhaar numbers", "social security numbers"] for d in b.data_classes)
    ]
    if identity_breaches:
        actions.append(ActionItem(
            priority=priority,
            action="Set up credit monitoring and consider freezing your credit report",
            reason=f"Identity documents were exposed in the {', '.join(identity_breaches[:2])} breach(es).",
            category="monitoring",
        ))
        priority += 1

    # Platform presence advice
    found_platforms = [p for p in platforms if p.status == "found"]
    if len(found_platforms) >= 5:
        platform_names = ", ".join(p.platform for p in found_platforms[:4])
        actions.append(ActionItem(
            priority=priority,
            action=f"Review privacy settings on: {platform_names}",
            reason=f"Your username is publicly findable on {len(found_platforms)} platforms. Consider using different usernames for different contexts.",
            category="privacy",
        ))
        priority += 1

    # General advice based on score
    if score.score >= 50:
        actions.append(ActionItem(
            priority=priority,
            action="Use a password manager to generate unique passwords for every site",
            reason="With a high exposure score, reusing passwords puts all your accounts at risk.",
            category="password",
        ))
        priority += 1

    return actions
