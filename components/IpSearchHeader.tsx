"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getIpSpecialType,
  isValidIpAddress,
} from "@/lib/ip";

interface IpSearchHeaderProps {
  initialIp?: string;
}

export default function IpSearchHeader({
  initialIp = "",
}: IpSearchHeaderProps) {
  const router = useRouter();

  const [value, setValue] = useState(initialIp);
  const [placeholder, setPlaceholder] = useState("输入 IP 地址");
  const [error, setError] = useState(false);

  useEffect(() => {
    setValue(initialIp);
  }, [initialIp]);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const inputValue = value.trim();

    setValue(inputValue);

    // IP 格式错误
    if (!isValidIpAddress(inputValue)) {
      showError("输入 IP 地址");
      return;
    }

    // 私有 / 特殊 IP
    const specialType = getIpSpecialType(inputValue);

    if (specialType) {
      showError(specialType);
      return;
    }

    setError(false);
    setPlaceholder("输入 IP 地址");

    router.push(
      `/ip?ip=${encodeURIComponent(inputValue)}`
    );
  }

  function showError(message: string) {
    setError(true);

    const oldValue = value;

    setValue("");
    setPlaceholder(message);

    setTimeout(() => {
      setValue(oldValue);
    }, 600);
  }

  function handleInput(nextValue: string) {
    setValue(nextValue);
    setError(false);
    setPlaceholder("输入 IP 地址");
  }

  return (
    <div className="flex w-full items-center justify-center gap-8 py-7 max-[700px]:flex-col max-[700px]:gap-4">
      {/* Logo */}
      <div className="flex shrink-0 items-center justify-center">
        <Link href="/" title="返回主页">
          <Image
            src="/images/logo.png"
            alt="IP 地理"
            title="IP 地理 Logo"
            width={120}
            height={120}
            priority
            className="h-[7.5em] w-[7.5em] object-contain"
          />
        </Link>
      </div>

      {/* 右侧 */}
      <div className="flex min-w-0 flex-1 flex-col gap-3.5">
        {/* 菜单 */}
        <div className="flex min-h-6 w-full flex-wrap items-center">
          <div className="flex w-full flex-wrap items-center text-[12px] leading-[18px] text-[#000099]">
            <Link
              href="/"
              className="mx-2 font-bold underline decoration-dashed underline-offset-4 first:ml-0"
            >
              首页
            </Link>

            <span>|</span>

            <a
              href="https://api.garinasset.com/ip/redoc"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2 underline decoration-dashed underline-offset-4"
            >
              API : <strong>免费</strong>
            </a>

            <span>|</span>

            <a
              href="https://db-ip.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2 underline decoration-dashed underline-offset-4"
            >
              数据库 : <strong>DB-IP</strong>
            </a>

            <span>|</span>

            <a
              href="https://api.garinasset.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2 underline decoration-dashed underline-offset-4"
            >
              应用 & 接口 : <strong>嘉林数据</strong>
            </a>
          </div>
        </div>

        {/* 搜索框 */}
        <form
          onSubmit={submit}
          className="flex w-full min-w-0 items-center gap-2.5"
          noValidate
        >
          <input
            value={value}
            onChange={(e) => handleInput(e.target.value)}
            title="搜索"
            placeholder={placeholder}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            inputMode="text"
            enterKeyHint="search"
            className={[
              "h-[3.125em] min-w-0 flex-1 rounded-[1.625em]",
              "border bg-white px-3 text-base text-[rgba(0,0,0,.87)]",
              "outline-none shadow-[0_0.1875em_0.625em_0_rgba(31,31,31,.08)]",
              "placeholder:text-[#9aa0a6]",
              error
                ? "border-[#d93025] shadow-[0_0_0.25em_rgba(217,48,37,.6)]"
                : "border-[#dadce0]",
            ].join(" ")}
          />

          <button
            type="submit"
            className="h-[3.125em] min-w-[3.375em] shrink-0 rounded-xl border border-[#f8f9fa] bg-[#f8f9fa] px-4 text-sm font-medium text-[#3c4043] shadow-[0_0.1875em_0.625em_0_rgba(31,31,31,.08)] transition hover:border-[#dadce0] hover:text-[#202124] focus:border-[#4285f4] focus:outline-none"
          >
            查询
          </button>
        </form>
      </div>
    </div>
  );
}