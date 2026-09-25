"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getIpSpecialType, isValidIpAddress } from "@/lib/ip";

interface SearchProps {
  mode: "home" | "query";
  initialIp?: string;
}

export default function Search({ mode, initialIp = "" }: SearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(initialIp);
  const [placeholder, setPlaceholder] = useState("输入 IP 地址");
  const [error, setError] = useState(false);

  useEffect(() => {
    setValue(initialIp);
  }, [initialIp]);

  function showError(message: string) {
    const oldValue = value;
    setError(true);
    setValue("");
    setPlaceholder(message);

    window.setTimeout(() => {
      setValue(oldValue);
      requestAnimationFrame(() => inputRef.current?.select());
    }, 600);
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const inputValue = value.trim();
    setValue(inputValue);

    if (!isValidIpAddress(inputValue)) {
      showError("输入 IP 地址");
      return;
    }

    const specialType = getIpSpecialType(inputValue);
    if (specialType) {
      showError(specialType);
      return;
    }

    setError(false);
    setPlaceholder("输入 IP 地址");
    router.push(`/?ip=${encodeURIComponent(inputValue)}`);
  }

  const query = mode === "query";

  return (
    <form
      data-flip="search"
      onSubmit={submit}
      noValidate
      className={query
        ? "flex w-full min-w-0 flex-col items-center gap-3 lg:flex-row lg:items-center lg:gap-2.5"
        : "w-full"}
    >
      <div className={query ? "w-full min-w-0 lg:flex-1" : "mx-auto w-full max-w-[43em] pt-1.5"}>
        <div
          className={query
            ? "w-full min-w-0"
            : [
                "relative flex min-h-[3.125em] w-full items-center",
                "rounded-[1.625em] border bg-white",
                "shadow-[0_0.1875em_0.625em_0_rgba(31,31,31,.08)]",
                error
                  ? "border-[#d93025] shadow-[0_0_0.25em_rgba(217,48,37,.6)]"
                  : "border-[#dadce0]",
              ].join(" ")}
        >
          {!query && (
            <div className="flex h-[3.125em] items-center px-3.5 text-[#bdc1c6]">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </div>
          )}
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
              setPlaceholder("输入 IP 地址");
            }}
            onFocus={() => query && inputRef.current?.select()}
            title="搜索"
            placeholder={placeholder}
            maxLength={2048}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            inputMode="text"
            enterKeyHint="search"
            autoFocus={!query}
            className={query
              ? [
                  "h-[3.125em] w-full min-w-0",
                  "rounded-[1.625em] border bg-white px-3",
                  "text-base text-[rgba(0,0,0,.87)] outline-none",
                  "shadow-[0_0.1875em_0.625em_0_rgba(31,31,31,.08)]",
                  "placeholder:text-[#9aa0a6]",
                  "transition focus:border-[#4285f4]",
                  error
                    ? "border-[#d93025] shadow-[0_0_0.25em_rgba(217,48,37,.6)]"
                    : "border-[#dadce0]",
                  "lg:flex-1",
                ].join(" ")
              : "h-[3.125em] min-w-0 flex-1 bg-transparent px-0 text-base text-[rgba(0,0,0,.87)] outline-none placeholder:text-[#9aa0a6]"}
          />
        </div>
      </div>

      <div className={query ? "flex h-auto justify-center" : "flex h-auto justify-center px-4 py-2"}>
        <button
          type="submit"
          className="h-[3.125em] w-24 shrink-0 rounded-xl border border-[#f8f9fa] bg-[#f8f9fa] px-4 text-sm font-medium text-[#3c4043] shadow-[0_0.1875em_0.625em_0_rgba(31,31,31,.08)] hover:border-[#dadce0] hover:text-[#202124] focus:border-[#4285f4] focus:outline-none"
        >
          查询
        </button>
      </div>
    </form>
  );
}
