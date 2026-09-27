"use client";

import { useEffect, useRef } from "react";

interface ApiResponse {
  country?: string;
  [key: string]: unknown;
}

interface ApiTryoutProps {
  ip: string;
  data: ApiResponse | null;
  loading: boolean;
}

interface AutoResizeTextareaProps {
  value: string;
  className?: string;
  minHeight?: number;
}

function AutoResizeTextarea({
  value,
  className = "",
  minHeight = 64,
}: AutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // 先恢复自动高度，避免内容减少后高度无法缩小
    textarea.style.height = "auto";

    // 根据实际内容高度调整
    textarea.style.height = `${Math.max(
      textarea.scrollHeight,
      minHeight,
    )}px`;
  }, [value, minHeight]);

  return (
    <textarea
      ref={textareaRef}
      readOnly
      value={value}
      rows={1}
      className={`box-border w-full resize-none overflow-hidden rounded-[0.5em] border border-[#dadce0] bg-white px-[1em] py-[0.875em] font-mono text-[0.9375em] leading-[1.6] text-[rgb(0,0,153)] shadow-[0_0.1875em_0.625em_0_rgba(31,31,31,0.08)] outline-none ${className}`}
    />
  );
}

export default function ApiTryout({
  ip,
  data,
  loading,
}: ApiTryoutProps) {
  const apiUrl = `https://api.garinasset.com/ip/${ip}`;

  const response =
    loading || !data
      ? ""
      : JSON.stringify(data, null, 2);

  const responseCountry =
    loading || !data
      ? ""
      : data.country ?? "";

  return (
    <div className="flex w-full max-w-[52rem] flex-col space-y-4 box-border">

      {/* ============================== */}
      {/* 试试接口 */}
      {/* ============================== */}

      <h3 className="text-base font-bold leading-[1.5] text-[rgb(0,0,153)]">
        <a
          href="https://api.garinasset.com/ip/redoc"
          target="_blank"
          rel="noopener noreferrer"
          className="text-inherit underline decoration-dashed decoration-[rgba(0,0,153,0.35)] underline-offset-[0.2em]"
        >
          试试接口
        </a>
      </h3>

      <AutoResizeTextarea
        value={`curl ${apiUrl}`}
        minHeight={32}
      />

      {/* ============================== */}
      {/* 响应内容 */}
      {/* ============================== */}

      <h3 className="text-base font-bold leading-[1.5] text-[rgb(0,0,153)]">
        <a
          href={data ? apiUrl : "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-inherit underline decoration-dashed decoration-[rgba(0,0,153,0.35)] underline-offset-[0.2em]"
        >
          响应内容
        </a>
      </h3>

      <AutoResizeTextarea
        value={response}
        minHeight={288}
      />

      {/* ============================== */}
      {/* 试试接口 (返回国家代码) */}
      {/* ============================== */}

      {/* <h3 className="text-base font-bold leading-[1.5] text-[rgb(0,0,153)]">
        <a
          href="https://api.garinasset.com/ip/redoc"
          target="_blank"
          rel="noopener noreferrer"
          className="text-inherit underline decoration-dashed decoration-[rgba(0,0,153,0.35)] underline-offset-[0.2em]"
        >
          试试接口
        </a>
      </h3>

      <AutoResizeTextarea
        value={`curl ${apiUrl}/country`}
        minHeight={32}
      /> */}

      {/* ============================== */}
      {/* 响应内容 (返回国家代码) */}
      {/* ============================== */}

      {/* <h3 className="text-base font-bold leading-[1.5] text-[rgb(0,0,153)]">
        <a
          href={data ? `${apiUrl}/country` : "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-inherit underline decoration-dashed decoration-[rgba(0,0,153,0.35)] underline-offset-[0.2em]"
        >
          响应内容
        </a>
      </h3>

      <AutoResizeTextarea
        value={responseCountry}
        minHeight={32}
      /> */}
    </div>
  );
}