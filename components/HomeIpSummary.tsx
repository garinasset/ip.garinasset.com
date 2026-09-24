"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  fetchClientIp,
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

export default function HomeIpSummary() {
  const [data, setData] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [dots, setDots] = useState("·");
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // 加载期间显示动态省略号。
    const dotTimer = window.setInterval(() => {
      setDots((current) => {
        if (current === "·") return "··";
        if (current === "··") return "···";
        return "·";
      });
    }, 350);

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

    return () => {
      cancelled = true;
      window.clearInterval(dotTimer);
    };
  }, []);

  function value(actualValue: string | null | undefined) {
    if (loading) {
      return dots;
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
          <Value>
            {loading || error || !data?.ip ? (
              value(data?.ip)
            ) : (
              <Link
                href={`/ip?ip=${encodeURIComponent(data.ip)}`}
                className="underline decoration-dashed decoration-[rgba(0,0,153,0.45)] underline-offset-[0.25em] hover:decoration-solid"
              >
                {data.ip}
              </Link>
            )}
          </Value>
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