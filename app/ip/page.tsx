"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import IpSearchHeader from "@/components/IpSearchHeader";
import IpResult from "@/components/IpResult";
import ApiTryout from "@/components/ApiTryout";

import {
  isValidIpAddress,
} from "@/lib/ip";

import {
  fetchIpInfo,
} from "@/lib/api";

interface IpInfo {
  ip?: string;
  country?: string;
  region?: string;
  city?: string;
  longitude?: number | null;
  latitude?: number | null;
  ISP?: string;
  ASN?: number | string;
  ASO?: string;
}

export default function IpPage() {
  const searchParams = useSearchParams();

  const queryIp = searchParams.get("ip") ?? "";

  const [data, setData] =
    useState<IpInfo | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!queryIp) {
      setData(null);
      setLoading(false);
      return;
    }

    if (!isValidIpAddress(queryIp)) {
      setData(null);
      setLoading(false);
      setError(
        "URL 中的 IP 地址不是有效 IP 地址"
      );
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      setData(null);

      try {
        const result =
          await fetchIpInfo(queryIp);

        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(
            "未收到服务器的正确响应, 请您检查网络连接或尝试刷新页面重试。"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [queryIp]);

  if (!queryIp) {
    return (
      <main className="min-h-screen w-full font-[Arial,sans-serif]">
        <div className="mx-auto w-full max-w-[64rem]">
          <IpSearchHeader initialIp={queryIp} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full font-[Arial,sans-serif]">
      <div className="page-shell mx-auto w-full px-6 max-[600px]:px-4">

        {/* ================================= */}
        {/* 顶部 */}
        {/* ================================= */}

        <div className="mx-auto w-full max-w-[64rem]">
          <IpSearchHeader initialIp={queryIp} />
        </div>

        {/* ================================= */}
        {/* 查询结果 */}
        {/* ================================= */}

        <div className="flex w-full flex-shrink-0 flex-col items-center pb-6 box-border">

          <div className="flex w-full max-w-[54rem] flex-col items-center rounded-[0.875em] bg-[#fafafa] px-4 pb-6 pt-[0.25em] box-border">

            {/* 结果列表 */}
            <IpResult
              ip={queryIp}
              data={data}
              loading={loading}
            />

            {/* API */}
            <ApiTryout
              ip={queryIp}
              data={data}
              loading={loading}
            />

            {/* 错误 */}
            {error && (
              <div className="mt-4 text-center text-red-600">
                {error}
              </div>
            )}

          </div>
        </div>

      </div>
    </main>
  );
}