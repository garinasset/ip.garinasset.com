const API_BASE =
  "https://api.garinasset.com";

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
  url: string
): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status}`
    );
  }

  return response.json() as Promise<T>;
}


/**
 * 获取当前客户端 IP
 */
export function fetchClientIp() {
  return fetchJson<IpInfo>(
    `${API_BASE}/ip/client`
  );
}


/**
 * 查询指定 IP
 */
export function fetchIpInfo(ip: string) {
  return fetchJson<IpInfo>(
    `${API_BASE}/ip/${encodeURIComponent(ip)}`
  );
}