
import Link from "next/link";

import { useEffect, useState } from "react";

import LoadingDots from "@/components/LoadingDots";

import {
  fetchClientIp,
  fetchClientIpAddress,
  type IpInfo,
} from "@/lib/api";

import { countryCodeToFlag, toDMS } from "@/lib/ip";

const textClass =
  "text-[0.75em] leading-[1.125em] text-[rgb(0,0,153)]";

const valueClass = `${textClass} font-bold`;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="text-center">
      <div className={`${textClass} mb-1`}>
        {title}
      </div>

      <div className="space-y-1">
        {children}
      </div>
    </section>
  );
}

function Value({
  children,
  breakAll = false,
}: {
  children: React.ReactNode;
  breakAll?: boolean;
}) {
  return (
    <div
      className={`${valueClass} break-words ${
        breakAll ? "break-all" : ""
      }`}
    >
      {children}
    </div>
  );
}

export default function ContentClient() {
  const [data, setData] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ipv4, setIpv4] = useState<string | null>(null);
  const [ipv6, setIpv6] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 60000);

    async function loadClientIp() {
      try {
        // API 请求统一由 lib/api.ts 处理。
        const result = await fetchClientIp();

        // 组件已经卸载时，不再更新 React 状态。
        if (cancelled) {
          return;
        }

        setData(result);
        setError(false);
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error("获取客户端 IP 失败:", err);
        setError(true);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadClientIp();

    async function loadAddress(
      version: "IPv4" | "IPv6",
      setAddress: (address: string) => void,
    ) {
      try {
        const address = await fetchClientIpAddress(version, controller.signal);
        if (!cancelled) {
          setAddress(address);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(`获取 ${version} 地址失败:`, err);
          setAddress("None");
        }
      }
    }

    void loadAddress("IPv4", setIpv4);
    void loadAddress("IPv6", setIpv6);

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);

  function value(actualValue: string | null | undefined) {
    if (loading) {
      return <LoadingDots />;
    }

    if (error) {
      return "没有收到服务器的数据响应: 请刷新页面重试.";
    }

    return actualValue || "None";
  }

  const countryValue = data?.country
    ? `${countryCodeToFlag(data.country)} ${data.country}`
    : undefined;

  const longitudeValue =
    data?.longitude != null
      ? toDMS(data.longitude, "lon")
      : undefined;

  const latitudeValue =
    data?.latitude != null
      ? toDMS(data.latitude, "lat")
      : undefined;

  return (
    <div className="w-full px-4">
      <div className="mx-auto flex w-full max-w-[43em] flex-col items-center space-y-6 text-center">

        {/* 您的 IP */}
        <Section title="您的 IP">
          {(["IPv4", "IPv6"] as const).map((version) => {
            const address = version === "IPv4" ? ipv4 : ipv6;
            return (
              <div key={version}>
                <span
                  className={`inline-block rounded px-1.5 py-0.5 text-[11px] leading-[1.25] font-bold text-white ${
                    version === "IPv4" ? "bg-[#b45309]" : "bg-[#1d4ed8]"
                  }`}
                >
                  {version}
                </span>
                <Value>
                  {address && address !== "None" ? (
                    <Link
                      href={`/?ip=${encodeURIComponent(address)}`}
                      className="underline decoration-dashed decoration-[rgba(0,0,153,0.45)] underline-offset-[0.25em] hover:decoration-solid"
                    >
                      {address}
                    </Link>
                  ) : (
                    address ?? <LoadingDots />
                  )}
                </Value>
              </div>
            );
          })}
        </Section>

        {/* 地理信息 */}
        <Section title="地理信息">
          <Value>{value(countryValue)}</Value>
          <Value>{value(data?.region)}</Value>
          <Value>{value(data?.city)}</Value>
          <Value>{value(longitudeValue)}</Value>
          <Value>{value(latitudeValue)}</Value>
        </Section>

        {/* ISP */}
        <Section title="ISP">
          <Value>{value(data?.ISP)}</Value>
        </Section>

        {/* ASO */}
        <Section title="ASO">
          <Value>{value(data?.ASO)}</Value>
        </Section>

        {/* 客户端 */}
        <Section title="您的客户端">
          <Value breakAll>
            {value(data?.user_agent)}
          </Value>
        </Section>

      </div>
    </div>
  );
}