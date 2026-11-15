"use client";

import { useEffect, useState } from "react";

import Brand from "@/components/Brand";
import Search from "@/components/Search";
import ContentClient from "@/components/ContentClient";
import ContentIp from "@/components/ContentIp";
import ApiTryout from "@/components/ApiTryout";
import Footer from "@/components/Footer";

import { fetchIpInfo, type IpInfo } from "@/lib/api";
import { isValidIpAddress } from "@/lib/ip";

export default function HomePageContent({ queryIp = "" }: { queryIp?: string }) {
  const mode = queryIp ? "query" : "home";

  const [data, setData] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(Boolean(queryIp));
  const [error, setError] = useState("");
  const [stateQuery, setStateQuery] = useState(queryIp);

  const queryChanged = queryIp !== stateQuery;
  const currentData = queryChanged ? null : data;
  const queryLoading = loading || queryChanged;

  useEffect(() => {
    if (!queryIp) {
      // Preserve the existing reset when returning to the home page.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setData(null);
      setLoading(false);
      setError("");
      setStateQuery(queryIp);
      return;
    }

    if (!isValidIpAddress(queryIp)) {
      setData(null);
      setLoading(false);
      setError("❌ URL 中的 IP 地址不是有效 IP 地址");
      setStateQuery(queryIp);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      setData(null);
      setStateQuery(queryIp);

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

          {/* Error section */}
          {!queryChanged && error && (
            <div className="text-center text-red-600">
              {error}
            </div>
          )}

          {/* Content section */}
          <div className="box-border px-4 lg:px-8 py-4 flex w-full max-w-[54rem] flex-col items-center rounded-[0.875em] bg-[#fafafa]">
            <ContentIp
              ip={queryIp}
              data={currentData}
              loading={queryLoading}
            />
          </div>

          {/* API Tryout section */}
          <div className="box-border px-4 lg:px-8 py-4 flex w-full max-w-[54rem] flex-col items-center rounded-[0.875em] bg-[#fafafa]">
            <ApiTryout
              ip={queryIp}
              data={currentData}
              loading={queryLoading}
            />

          </div>




          {/* Footer section */}
          <div className="mt-auto pb-4">
            <Footer />
          </div>


        </main>
      )}
    </>
  );
}