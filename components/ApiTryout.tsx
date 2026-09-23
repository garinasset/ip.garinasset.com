"use client";

import { useEffect, useRef } from "react";

interface ApiTryoutProps {
  ip: string;
  data: unknown;
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

  return (
    <div className="mt-[1.25em] w-full max-w-[52rem] box-border">

      {/* ============================== */}
      {/* 试试接口 */}
      {/* ============================== */}

      <h3 className="m-0 mb-[0.5em] text-base font-bold leading-[1.5] text-[rgb(0,0,153)]">
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

      <div className="mt-[1.25em] w-full">
        <h3 className="m-0 mb-[0.5em] text-base font-bold leading-[1.5] text-[rgb(0,0,153)]">
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
      </div>
    </div>
  );
}