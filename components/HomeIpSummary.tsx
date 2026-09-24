"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { countryCodeToFlag, toDMS } from "@/lib/ip";

interface ClientIpInfo {
  ip?: string;
  country?: string;
  region?: string;
  city?: string;
  longitude?: number | null;
  latitude?: number | null;
  ISP?: string;
  ASO?: string;
  user_agent?: string;
}

const API_URL = "https://api.garinasset.com/ip/client";
const REQUEST_TIMEOUT = 3000;
const MAX_ATTEMPTS = 2;

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
  const [data, setData] = useState<ClientIpInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [dots, setDots] = useState("·");
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let activeController: AbortController | null = null;

    const dotTimer = window.setInterval(() => {
      setDots((current) => {
        if (current === "·") return "··";
        if (current === "··") return "···";
        return "·";
      });
    }, 350);

    async function loadClientIp() {
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        if (cancelled) {
          return;
        }

        const controller = new AbortController();
        activeController = controller;

        const timeout = window.setTimeout(() => {
          controller.abort();
        }, REQUEST_TIMEOUT);

        try {
          const response = await fetch(API_URL, {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const result =
            (await response.json()) as ClientIpInfo;

          if (cancelled) {
            return;
          }

          setData(result);
          setError(false);
          setLoading(false);

          return;
        } catch (err) {
          if (cancelled) {
            return;
          }

          // 第一次失败：立即进入第二次请求
          if (attempt === MAX_ATTEMPTS - 1) {
            console.error("获取客户端 IP 失败:", err);

            setError(true);
            setLoading(false);
          }
        } finally {
          window.clearTimeout(timeout);

          if (activeController === controller) {
            activeController = null;
          }
        }
      }
    }

    loadClientIp();

    return () => {
      cancelled = true;

      activeController?.abort();

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