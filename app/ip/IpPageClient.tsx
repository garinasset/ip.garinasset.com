"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import IpSearchHeader from "@/components/IpSearchHeader";
import IpResult from "@/components/IpResult";
import ApiTryout from "@/components/ApiTryout";

import { isValidIpAddress } from "@/lib/ip";
import { fetchIpInfo } from "@/lib/api";
import Footer from "@/components/Footer";

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

export default function IpPageClient() {
  const searchParams = useSearchParams();
  const queryIp = searchParams.get("ip") ?? "";

  const [data, setData] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!queryIp) {
      setData(null);
      setLoading(false);
      setError("");
      return;
    }

    if (!isValidIpAddress(queryIp)) {
      setData(null);
      setLoading(false);
      setError("URL 中的 IP 地址不是有效 IP 地址");
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      setData(null);

      try {
        const result = await fetchIpInfo(queryIp);

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

  /*
   * 没有 IP 参数时，只显示 Header。
   */
  if (!queryIp) {
    return (
      <main className="min-h-screen w-full font-[Arial,sans-serif]">
        <div className="mx-auto w-full px-6 max-[600px]:px-4">
          <IpSearchHeader initialIp="" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full font-[Arial,sans-serif]">
      <div className="mx-auto w-full px-6 max-[600px]:px-4">

        {/* Header */}
        <IpSearchHeader initialIp={queryIp} />

        {/* 查询结果 */}
        <div className="flex w-full flex-col items-center space-y-4 pb-6">
          <div className="box-border flex w-full max-w-[54rem] flex-col items-center rounded-[0.875em] bg-[#fafafa] px-4 pt-1">

            <IpResult
              ip={queryIp}
              data={data}
              loading={loading}
            />

          </div>
          <div className="box-border flex w-full max-w-[54rem] flex-col items-center rounded-[0.875em] bg-[#fafafa] px-4 pb-6 pt-1">


            <ApiTryout
              ip={queryIp}
              data={data}
              loading={loading}
            />

            {error && (
              <div className="mt-4 text-center text-red-600">
                {error}
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="block lg:hidden">
          <Footer />
        </div>

      </div>
    </main>
  );
}