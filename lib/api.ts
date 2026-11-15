import { isValidIpAddress } from "@/lib/ip";

const API_BASE = "https://api.garinasset.com";

const CLIENT_IP_ENDPOINTS = {
  IPv4: "https://ip64.onrender.com/ip",
  IPv6: "https://ip64.garinasset.com:8443/ip/",
};

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

/**
 * 通用 GET JSON 请求。
 * 统一处理 HTTP 错误和 JSON 解析。
 */
async function fetchJson<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return (await response.json()) as T;
}

/**
 * 获取当前访问者的 IP 信息。
 *
 * /ip/client 返回的是当前客户端信息，
 * 因此禁止浏览器缓存，避免使用旧的客户端 IP。
 */
export function fetchClientIp() {
  return fetchJson<IpInfo>(
    `${API_BASE}/ip/client`,
    {
      cache: "no-store",
    }
  );
}

export async function fetchClientIpAddress(
  version: keyof typeof CLIENT_IP_ENDPOINTS,
  signal: AbortSignal,
) {
  const response = await fetch(CLIENT_IP_ENDPOINTS[version], {
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const ip = (await response.text()).trim();
  if (!isValidIpAddress(ip) || (version === "IPv6") !== ip.includes(":")) {
    throw new Error(`Invalid ${version} address returned by the endpoint`);
  }

  return ip;
}

/**
 * 查询指定 IP 的信息。
 *
 * IP 已进行 encodeURIComponent，
 * 避免 IP 作为 URL 路径时产生特殊字符问题。
 */
export function fetchIpInfo(ip: string) {
  return fetchJson<IpInfo>(
    `${API_BASE}/ip/${encodeURIComponent(ip)}`
  );
}