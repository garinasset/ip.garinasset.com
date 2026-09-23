export function isValidIpAddress(value: string): boolean {
  if (!value || typeof value !== "string") {
    return false;
  }

  // IPv4
  const ipv4Parts = value.split(".");

  if (
    ipv4Parts.length === 4 &&
    ipv4Parts.every((part) => {
      const n = Number(part);

      return (
        String(n) === part &&
        n >= 0 &&
        n <= 255
      );
    })
  ) {
    return true;
  }

  // IPv6
  try {
    new URL(`http://[${value}]/`);
    return true;
  } catch {
    return false;
  }
}


/**
 * 判断是否为私有 / 特殊 IP 地址
 *
 * 保持原 index.html / ip.html 的判断逻辑
 */
export function getIpSpecialType(ip: string): string | null {
  // IPv4
  if (ip.includes(".")) {
    const p = ip.split(".").map(Number);
    const [a, b, c, d] = p;

    // 255.255.255.255 Broadcast
    if (
      a === 255 &&
      b === 255 &&
      c === 255 &&
      d === 255
    ) {
      return "IPv4 Broadcast 地址 (RFC919)";
    }

    // 255.X.X.X
    if (a === 255) {
      return "IPv4 E类保留地址 (IANA)";
    }

    // 0.0.0.0/8
    if (a === 0) {
      return "IPv4 未指定地址范围 0.0.0.0/8 (RFC1122)";
    }

    // 10.0.0.0/8
    if (a === 10) {
      return "私有 IPv4 地址 10.0.0.0/8 (RFC1918)";
    }

    // 172.16.0.0/12
    if (a === 172 && b >= 16 && b <= 31) {
      return "私有 IPv4 地址 172.16.0.0/12 (RFC1918)";
    }

    // 192.168.0.0/16
    if (a === 192 && b === 168) {
      return "私有 IPv4 地址 192.168.0.0/16 (RFC1918)";
    }

    // 100.64.0.0/10
    if (a === 100 && b >= 64 && b <= 127) {
      return "运营商级 NAT 地址 100.64.0.0/10 (RFC6598)";
    }

    // 127.0.0.0/8
    if (a === 127) {
      return "IPv4 回环地址 127.0.0.0/8 (RFC1122)";
    }

    // 169.254.0.0/16
    if (a === 169 && b === 254) {
      return "IPv4 Link-Local 地址 169.254.0.0/16 (RFC3927)";
    }

    // 224.0.0.0/4
    if (a >= 224 && a <= 239) {
      return "IPv4 Multicast 地址 224.0.0.0/4 (RFC1112)";
    }

    // 192.0.2.0/24
    if (a === 192 && b === 0 && c === 2) {
      return "IPv4 文档示例地址 192.0.2.0/24 (RFC5737)";
    }

    // 198.51.100.0/24
    if (a === 198 && b === 51 && c === 100) {
      return "IPv4 文档示例地址 198.51.100.0/24 (RFC5737)";
    }

    // 203.0.113.0/24
    if (a === 203 && b === 0 && c === 113) {
      return "IPv4 文档示例地址 203.0.113.0/24 (RFC5737)";
    }

    // 240.0.0.0/4
    if (a >= 240 && a <= 254) {
      return "IPv4 保留地址 240.0.0.0/4 (RFC6890)";
    }

    return null;
  }

  // IPv6
  if (ip.includes(":")) {
    const lower = ip.toLowerCase();

    // ::1
    if (lower === "::1") {
      return "IPv6 回环地址 ::1 (RFC4291)";
    }

    // ::
    if (lower === "::") {
      return "IPv6 未指定地址 :: (RFC4291)";
    }

    // fc00::/7
    if (
      lower.startsWith("fc") ||
      lower.startsWith("fd")
    ) {
      return "IPv6 私有地址 fc00::/7 (RFC4193)";
    }

    // fe80::/10
    if (
      lower.startsWith("fe8") ||
      lower.startsWith("fe9") ||
      lower.startsWith("fea") ||
      lower.startsWith("feb")
    ) {
      return "IPv6 Link-Local 地址 fe80::/10 (RFC4291)";
    }

    // ff00::/8
    if (lower.startsWith("ff")) {
      return "IPv6 Multicast 地址 ff00::/8 (RFC4291)";
    }

    // 2001:db8::/32
    if (lower.startsWith("2001:db8")) {
      return "IPv6 文档示例地址 2001:db8::/32 (RFC3849)";
    }

    return null;
  }

  return null;
}


/**
 * 国家代码转国旗
 */
export function countryCodeToFlag(code: string): string {
  if (!code || code.length !== 2) {
    return "";
  }

  const first =
    code.toUpperCase().charCodeAt(0) -
    65 +
    0x1f1e6;

  const second =
    code.toUpperCase().charCodeAt(1) -
    65 +
    0x1f1e6;

  return String.fromCodePoint(first, second);
}


/**
 * 十进制度数转换为：
 *
 * 116°21′36.00″E
 * 39°54′55.80″N
 */
export function toDMS(
  deg: number | null | undefined,
  type: "lat" | "lon"
): string {
  if (deg === null || deg === undefined) {
    return "";
  }

  const absolute = Math.abs(deg);

  const d = Math.floor(absolute);

  const minutesFloat = (absolute - d) * 60;

  const m = Math.floor(minutesFloat);

  const s = ((minutesFloat - m) * 60).toFixed(2);

  let direction = "";

  if (type === "lat") {
    direction = deg >= 0 ? "N" : "S";
  } else {
    direction = deg >= 0 ? "E" : "W";
  }

  return `${d}°${m}′${s}″${direction}`;
}