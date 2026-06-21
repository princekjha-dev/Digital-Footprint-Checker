"""Quick test for the scan endpoint."""
import httpx

r = httpx.post("http://localhost:8000/api/scan", json={"email": "test@example.com"})
print(f"Status: {r.status_code}")
data = r.json()
print(f"Demo mode: {data['demo_mode']}")
print(f"Breaches: {data['breach_count']}")
print(f"Indian breaches: {data['indian_breach_count']}")
print(f"Platforms found: {data['platforms_found']}")
print(f"Exposure score: {data['exposure_score']['score']}/100 ({data['exposure_score']['risk_label']})")
print(f"Action items: {len(data['action_items'])}")
print(f"Timestamp: {data['scan_timestamp']}")
print("\nFirst breach:")
if data["breaches"]:
    b = data["breaches"][0]
    print(f"  Name: {b['name']}")
    print(f"  Severity: {b['severity']}")
    print(f"  Explanation: {b.get('explanation', 'N/A')[:100]}...")
print("\nTest PASSED!")
