"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Brand from "@/components/Brand";
import Search from "@/components/Search";
import ContentClient from "@/components/ContentClient";
import ContentIp from "@/components/ContentIp";
import ApiTryout from "@/components/ApiTryout";
import Footer from "@/components/Footer";

import { fetchIpInfo, type IpInfo } from "@/lib/api";
import { isValidIpAddress } from "@/lib/ip";

function HomePage() {
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
        <main className="flex min-h-screen w-full flex-col items-center py-16 px-4 gap-4 font-[Arial,sans-serif]">

          <Brand mode="home" />
          <div className="w-full max-w-176">
            <Search mode="home" />
          </div>

          <ContentClient />

          <Footer />


        </main>
      ) : (
        <main className="min-h-screen w-full flex flex-col items-center p-4 sm:px-16 lg:p-8 gap-6 font-[Arial,sans-serif]">

          {/* Header section */}
          <header className="mx-auto flex w-full max-w-5xl flex-col items-center gap-5 lg:flex-row lg:items-center lg:gap-8">

            <div className="flex w-[7.5rem] shrink-0 justify-center">
              <Brand mode="query" />
            </div>

            <Search
              mode="query"
              initialIp={queryIp}
            />

          </header>

          {/* Content section */}
          <div className="box-border px-4 lg:px-8 py-4 flex w-full max-w-[54rem] flex-col items-center rounded-[0.875em] bg-[#fafafa]">
            <ContentIp
              ip={queryIp}
              data={data}
              loading={loading}
            />
          </div>

          {/* API Tryout section */}
          <div className="box-border px-4 lg:px-8 py-4 flex w-full max-w-[54rem] flex-col items-center rounded-[0.875em] bg-[#fafafa]">
            <ApiTryout
              ip={queryIp}
              data={data}
              loading={loading}
            />

          </div>


          {/* Error section */}
          {error && (
            <div className="m-4 text-center text-red-600">
              {error}
            </div>
          )}

          {/* Footer section */}
          <div className="mt-auto pb-4">
            <Footer />
          </div>


        </main>
      )}
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <HomePage />
    </Suspense>
  );
}