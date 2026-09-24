const API_BASE = "https://api.garinasset.com";

export interface IpInfo {
  ip?: string;
  country?: string;
  region?: string;
  city?: string;
  longitude?: number | null;
  latitude?: number | null;
  ISP?: string;
  ASN?: number | string;
  ASO?: string;
  user_agent?: string;
}

async function fetchJson<T>(
  url: string,
  timeout = 3000
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json() as T;
  } finally {
    clearTimeout(timer);
  }
}

export function fetchIpInfo(ip: string) {
  return fetchJson<IpInfo>(
    `${API_BASE}/ip/${encodeURIComponent(ip)}`
  );
}