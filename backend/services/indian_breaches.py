"""
Curated Indian breach dataset — manually maintained list of major Indian data breaches.
Based on publicly reported breach information only.
"""

from models.schemas import BreachInfo
from security.validators import sanitize_output


# Each breach entry contains: name, date, affected domain patterns, exposed data types,
# a human description, and source URL for transparency.
INDIAN_BREACHES = [
    {
        "name": "BigBasket",
        "title": "BigBasket Data Breach",
        "domain": "bigbasket.com",
        "breach_date": "2020-10-14",
        "pwn_count": 20000000,
        "description": "In October 2020, the Indian online grocery platform BigBasket suffered a data breach affecting approximately 20 million users. Exposed data was later found for sale on the dark web.",
        "data_classes": ["Email addresses", "Phone numbers", "Physical addresses", "Names", "Passwords", "Dates of birth"],
        "source_url": "https://www.bigbasket.com",
    },
    {
        "name": "Dominos India",
        "title": "Dominos India Data Breach",
        "domain": "dominos.co.in",
        "breach_date": "2021-04-18",
        "pwn_count": 18000000,
        "description": "In April 2021, Dominos India suffered a breach where order details of approximately 18 million customers were exposed, including names, phone numbers, email addresses, delivery addresses, and order history.",
        "data_classes": ["Email addresses", "Phone numbers", "Physical addresses", "Names"],
        "source_url": "https://www.dominos.co.in",
    },
    {
        "name": "MobiKwik",
        "title": "MobiKwik Data Breach",
        "domain": "mobikwik.com",
        "breach_date": "2021-03-01",
        "pwn_count": 3500000,
        "description": "In early 2021, reports surfaced of a massive data leak from the Indian digital wallet company MobiKwik involving KYC data, phone numbers, and email addresses of millions of users.",
        "data_classes": ["Email addresses", "Phone numbers", "Names", "Physical addresses"],
        "source_url": "https://www.mobikwik.com",
    },
    {
        "name": "Air India",
        "title": "Air India SITA Breach",
        "domain": "airindia.in",
        "breach_date": "2021-05-21",
        "pwn_count": 4500000,
        "description": "In May 2021, Air India disclosed a breach via their PSS provider SITA affecting 4.5 million passengers. Exposed data included names, dates of birth, contact information, passport details, and credit card data.",
        "data_classes": ["Email addresses", "Names", "Dates of birth", "Phone numbers", "Passport numbers", "Credit cards"],
        "source_url": "https://www.airindia.in",
    },
    {
        "name": "Unacademy",
        "title": "Unacademy Data Breach",
        "domain": "unacademy.com",
        "breach_date": "2020-05-03",
        "pwn_count": 22000000,
        "description": "In May 2020, the Indian ed-tech platform Unacademy suffered a breach exposing 22 million user accounts including usernames, email addresses, and hashed passwords.",
        "data_classes": ["Email addresses", "Usernames", "Passwords", "Names"],
        "source_url": "https://www.unacademy.com",
    },
    {
        "name": "JusPay",
        "title": "JusPay Payment Data Breach",
        "domain": "juspay.in",
        "breach_date": "2021-01-03",
        "pwn_count": 35000000,
        "description": "In January 2021, Indian payment processor JusPay reported a breach affecting 35 million users. Exposed data included email addresses, phone numbers, and masked card data.",
        "data_classes": ["Email addresses", "Phone numbers", "Names"],
        "source_url": "https://www.juspay.in",
    },
    {
        "name": "Dunzo",
        "title": "Dunzo Data Breach",
        "domain": "dunzo.com",
        "breach_date": "2020-07-18",
        "pwn_count": 3400000,
        "description": "In 2020, the Indian delivery platform Dunzo suffered a breach that exposed email addresses and phone numbers of approximately 3.4 million users.",
        "data_classes": ["Email addresses", "Phone numbers"],
        "source_url": "https://www.dunzo.com",
    },
    {
        "name": "Upstox",
        "title": "Upstox Data Breach",
        "domain": "upstox.com",
        "breach_date": "2021-04-11",
        "pwn_count": 2500000,
        "description": "In April 2021, Indian stock trading platform Upstox suffered a breach affecting 2.5 million users. KYC data including passport and PAN numbers were reportedly exposed.",
        "data_classes": ["Email addresses", "Phone numbers", "Names", "Passport numbers", "Dates of birth"],
        "source_url": "https://www.upstox.com",
    },
    {
        "name": "CoWIN",
        "title": "CoWIN Portal Data Exposure",
        "domain": "cowin.gov.in",
        "breach_date": "2023-06-12",
        "pwn_count": 0,
        "description": "In June 2023, data from India's COVID vaccination portal CoWIN was allegedly accessible via a Telegram bot. Reports indicated names, phone numbers, Aadhaar numbers, and vaccination details were exposed. The government disputed direct database access.",
        "data_classes": ["Phone numbers", "Names", "Aadhaar numbers"],
        "source_url": "https://www.cowin.gov.in",
    },
    {
        "name": "AIIMS Delhi",
        "title": "AIIMS Delhi Ransomware Attack",
        "domain": "aiims.edu",
        "breach_date": "2022-11-23",
        "pwn_count": 0,
        "description": "In November 2022, AIIMS Delhi was hit by a major ransomware attack that crippled digital services for several days. Patient data of millions including health records was potentially compromised.",
        "data_classes": ["Names", "Phone numbers", "Physical addresses"],
        "source_url": "https://www.aiims.edu",
    },
    {
        "name": "BSNL",
        "title": "BSNL Data Breach",
        "domain": "bsnl.co.in",
        "breach_date": "2023-12-20",
        "pwn_count": 0,
        "description": "In December 2023, Indian state-owned telecom BSNL reportedly suffered a breach with SIM card data, server snapshots, and user information exposed on dark web forums.",
        "data_classes": ["Email addresses", "Phone numbers", "Names"],
        "source_url": "https://www.bsnl.co.in",
    },
    {
        "name": "RailYatri",
        "title": "RailYatri Data Breach",
        "domain": "railyatri.in",
        "breach_date": "2023-02-17",
        "pwn_count": 31000000,
        "description": "In February 2023, Indian travel platform RailYatri suffered a breach exposing 31 million user records including email addresses, phone numbers, and travel booking details.",
        "data_classes": ["Email addresses", "Phone numbers", "Names"],
        "source_url": "https://www.railyatri.in",
    },
    {
        "name": "boAt",
        "title": "boAt Lifestyle Data Breach",
        "domain": "boat-lifestyle.com",
        "breach_date": "2024-04-05",
        "pwn_count": 7500000,
        "description": "In April 2024, Indian electronics brand boAt suffered a breach affecting 7.5 million customers. Exposed data included names, email addresses, phone numbers, and physical addresses.",
        "data_classes": ["Email addresses", "Phone numbers", "Names", "Physical addresses"],
        "source_url": "https://www.boat-lifestyle.com",
    },
    {
        "name": "ICMR",
        "title": "ICMR / Aadhaar Data Leak",
        "domain": "icmr.gov.in",
        "breach_date": "2023-10-09",
        "pwn_count": 0,
        "description": "In October 2023, data allegedly sourced from ICMR's COVID testing database was offered for sale, reportedly containing Aadhaar numbers, names, phone numbers, and addresses of hundreds of millions of Indian citizens.",
        "data_classes": ["Phone numbers", "Names", "Physical addresses", "Aadhaar numbers"],
        "source_url": "https://www.icmr.gov.in",
    },
    {
        "name": "WazirX",
        "title": "WazirX Crypto Exchange Breach",
        "domain": "wazirx.com",
        "breach_date": "2024-07-18",
        "pwn_count": 0,
        "description": "In July 2024, Indian cryptocurrency exchange WazirX suffered a $235 million security breach. While primarily a financial attack on the platform's wallets, user KYC data exposure was also a concern.",
        "data_classes": ["Email addresses", "Names"],
        "source_url": "https://www.wazirx.com",
    },
]


def check_email(email: str) -> list[BreachInfo]:
    """
    Check an email against the curated Indian breach dataset.
    
    Since we don't have actual breach data dumps, we return ALL Indian breaches
    as "potentially affected" — clearly labeled as informational.
    
    In a real implementation, you'd match email domains against breach-specific datasets.
    """
    results = []

    for breach in INDIAN_BREACHES:
        results.append(BreachInfo(
            name=sanitize_output(breach["name"]),
            title=sanitize_output(breach["title"]),
            domain=sanitize_output(breach["domain"]),
            breach_date=breach["breach_date"],
            pwn_count=breach.get("pwn_count", 0),
            description=sanitize_output(breach["description"]),
            data_classes=[sanitize_output(d) for d in breach["data_classes"]],
            is_verified=False,
            severity=_get_indian_severity(breach["data_classes"]),
            source="indian_dataset",
        ))

    return results


def _get_indian_severity(data_classes: list[str]) -> str:
    """Determine severity for Indian breach entries."""
    critical_types = {"passwords", "credit cards", "passport numbers", "aadhaar numbers"}
    high_types = {"phone numbers", "physical addresses", "dates of birth"}

    lower_classes = {d.lower() for d in data_classes}

    if lower_classes & critical_types:
        return "critical"
    if lower_classes & high_types:
        return "high"
    return "medium"
