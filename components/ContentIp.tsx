"use client";

import { useEffect, useState } from "react";

import {
  countryCodeToFlag,
  toDMS,
} from "@/lib/ip";

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

interface ContentIpProps {
  ip: string;
  data: IpInfo | null;
  loading: boolean;
}

export default function ContentIp
({
  ip,
  data,
  loading,
}: ContentIpProps) {
  return (
    <div className="mt-[0.875em] mb-16 box-border flex w-full max-w-[52rem] flex-col items-start p-0 text-base">
      <ResultItem
        label="IP:"
        value={data?.ip ?? ip}
      />

      <ResultItem
        label="国家/地区:"
        value={
          loading
            ? undefined
            : data?.country
              ? `${countryCodeToFlag(
                  data.country
                )} ${data.country.toUpperCase()}`
              : "None"
        }
      />

      <ResultItem
        label="省/州:"
        value={
          loading
            ? undefined
            : data?.region ?? "None"
        }
      />

      <ResultItem
        label="城市:"
        value={
          loading
            ? undefined
            : data?.city ?? "None"
        }
      />

      <ResultItem
        label="经度:"
        value={
          loading
            ? undefined
            : data?.longitude != null
              ? toDMS(data.longitude, "lon")
              : "None"
        }
      />

      <ResultItem
        label="纬度:"
        value={
          loading
            ? undefined
            : data?.latitude != null
              ? toDMS(data.latitude, "lat")
              : "None"
        }
      />

      <ResultItem
        label="ISP:"
        value={
          loading
            ? undefined
            : data?.ISP ?? "None"
        }
      />

      <ResultItem
        label="ASN:"
        value={
          loading
            ? undefined
            : data?.ASN ?? "None"
        }
      />

      <ResultItem
        label="ASO:"
        value={
          loading
            ? undefined
            : data?.ASO ?? "None"
        }
      />
    </div>
  );
}


function ResultItem({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <div className="box-border px-4 pt-[0.625em]">
      <div className="inline-flex shrink items-start gap-[0.625em] border-b border-dashed border-[rgba(0,0,153,0.12)] pb-[0.625em] box-border">
        {/* 左边 Key */}
        <div className="min-w-[5.5rem] font-bold leading-[1.5] text-[rgb(0,0,153)]">
          {label}
        </div>

        {/* 右边 Value */}
        <div className="inline-block max-w-full break-all text-left leading-[1.5] text-[rgb(0,0,153)]">
          {value === undefined ? (
            <DotAnimation />
          ) : (
            value
          )}
        </div>
      </div>
    </div>
  );
}


function DotAnimation() {
  const [dots, setDots] = useState("·");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDots((current) => {
        if (current === "·") return "··";
        if (current === "··") return "···";
        return "·";
      });
    }, 350);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return <>{dots}</>;
}