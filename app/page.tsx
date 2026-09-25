"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Brand from "@/components/Brand";
import Navigation from "@/components/Navigation";
import Search from "@/components/Search";
import ContentClient from "@/components/ContentClient";
import ContentIp from "@/components/ContentIp";
import ApiTryout from "@/components/ApiTryout";
import Footer from "@/components/Footer";

import { fetchIpInfo, type IpInfo } from "@/lib/api";
import { isValidIpAddress } from "@/lib/ip";

export default function HomePage() {
  const searchParams = useSearchParams();

  const queryIp = searchParams.get("ip") ?? "";
  const mode = queryIp ? "query" : "home";

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
            "未收到服务器的正确响应, 请您检查网络连接或尝试刷新页面重试。",
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

  return (
    <>
      {mode === "home" ? (
        <main className="flex min-h-screen w-full flex-col font-[Arial,sans-serif]">
          <div className="flex min-h-[5.75em] flex-col items-center pt-[3.75em]">
            <Brand mode="home" />
          </div>

          <div className="flex w-full flex-col items-center px-4 py-5">
            <Search mode="home" />
          </div>

          <div>
            <ContentClient />
          </div>

          <div>
            <Footer />
          </div>
        </main>
      ) : (
        <main className="min-h-screen w-full font-[Arial,sans-serif]">
          <div className="mx-auto w-full px-6 max-[600px]:px-4">
            <header className="w-full px-4 py-6">
              <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-5 lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:grid-rows-auto lg:gap-x-8 lg:gap-y-1">
                <div className="flex justify-center lg:row-span-2 lg:items-start lg:justify-center">
                  <Brand mode="query" />
                </div>

                <Navigation />

                <Search
                  mode="query"
                  initialIp={queryIp}
                />
              </div>
            </header>

            <div className="flex w-full flex-col items-center space-y-4 pb-6">
              <div className="box-border flex w-full max-w-[54rem] flex-col items-center rounded-[0.875em] bg-[#fafafa] px-4 pt-1">
                <ContentIp
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

            <div className="block lg:hidden">
              <Footer />
            </div>
          </div>
        </main>
      )}
    </>
  );
}