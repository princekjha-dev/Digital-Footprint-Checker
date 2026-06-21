/**
 * Backend API client — communicates with the FastAPI backend.
 * All requests go through the backend; the browser never calls HIBP directly.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface BreachInfo {
  name: string;
  title: string;
  domain: string;
  breach_date: string;
  added_date?: string;
  pwn_count?: number;
  description: string;
  data_classes: string[];
  is_verified: boolean;
  is_sensitive: boolean;
  logo_path?: string;
  severity: "low" | "medium" | "high" | "critical";
  source: "hibp" | "indian_dataset";
  explanation?: string;
}

export interface PlatformResult {
  platform: string;
  status: "found" | "not_found" | "error";
  url?: string;
  icon?: string;
}

export interface ExposureScore {
  score: number;
  risk_level: "green" | "yellow" | "orange" | "red";
  risk_label: string;
  breakdown: Record<string, number>;
}

export interface ActionItem {
  priority: number;
  action: string;
  reason: string;
  category: "password" | "2fa" | "privacy" | "monitoring";
}

export interface ScanResponse {
  demo_mode: boolean;
  breaches: BreachInfo[];
  breach_count: number;
  indian_breaches: BreachInfo[];
  indian_breach_count: number;
  platforms: PlatformResult[];
  platforms_found: number;
  exposure_score: ExposureScore;
  action_items: ActionItem[];
  scan_timestamp: string;
  disclaimer: string;
}

/**
 * Submit a scan request to the backend.
 * Email is sent via HTTPS POST — never in the URL.
 */
export async function submitScan(
  email: string,
  username?: string,
  honeypot?: string
): Promise<ScanResponse> {
  const response = await fetch(`${API_BASE}/api/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      username: username || null,
      honeypot: honeypot || null,
    }),
  });

  if (response.status === 429) {
    throw new Error("Rate limit exceeded. Please wait a few minutes and try again.");
  }

  if (response.status === 422) {
    const data = await response.json();
    throw new Error(data.detail || "Invalid input. Please check your email address.");
  }

  if (!response.ok) {
    throw new Error("Scan failed. Please try again later.");
  }

  return response.json();
}

/**
 * Download the PDF report.
 */
export async function downloadPdfReport(scanData: ScanResponse): Promise<Blob> {
  const response = await fetch(`${API_BASE}/api/report/pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(scanData),
  });

  if (!response.ok) {
    throw new Error("Failed to generate PDF report.");
  }

  return response.blob();
}
