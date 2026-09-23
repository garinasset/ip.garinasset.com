"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getIpSpecialType,
  isValidIpAddress,
} from "@/lib/ip";

export default function HomeSearch() {
  const router = useRouter();

  const [value, setValue] = useState("");
  const [placeholder, setPlaceholder] = useState("输入 IP 地址");
  const [error, setError] = useState(false);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const inputValue = value.trim();

    setValue(inputValue);

    // 非法 IP
    if (!isValidIpAddress(inputValue)) {
      showError("输入 IP 地址");
      return;
    }

    // 特殊 / 私有 IP
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
    const oldValue = value;

    setError(true);
    setValue("");
    setPlaceholder(message);

    setTimeout(() => {
      setValue(oldValue);
    }, 600);
  }

  return (
    <form
      onSubmit={submit}
      className="w-full"
      noValidate
    >
      <div className="mx-auto w-full max-w-[43em] pt-1.5">
        <div
          className={[
            "relative flex min-h-[3.125em] w-full items-center",
            "rounded-[1.625em] border bg-white",
            "shadow-[0_0.1875em_0.625em_0_rgba(31,31,31,.08)]",
            error
              ? "border-[#d93025] shadow-[0_0_0.25em_rgba(217,48,37,.6)]"
              : "border-[#dadce0]",
          ].join(" ")}
        >
          {/* 搜索图标 */}
          <div className="flex h-[3.125em] items-center px-3.5 text-[#bdc1c6]">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current"
            >
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </div>

          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
              setPlaceholder("输入 IP 地址");
            }}
            autoFocus
            title="搜索"
            placeholder={placeholder}
            maxLength={2048}
            spellCheck={false}
            autoComplete="off"
            className="h-[3.125em] min-w-0 flex-1 bg-transparent px-0 text-base text-[rgba(0,0,0,.87)] outline-none placeholder:text-[#9aa0a6]"
          />
        </div>
      </div>

      {/* 查询按钮 */}
      <div className="flex h-auto justify-center px-4 py-2">
        <button
          type="submit"
          className="my-2 h-8 min-w-16 rounded-xl border border-[#f8f9fa] bg-[#f8f9fa] px-3 text-sm text-[#3c4043] shadow-[0_0.1875em_0.625em_0_rgba(31,31,31,.08)] transition hover:border-[#dadce0] hover:text-[#202124]"
        >
          查询
        </button>
      </div>
    </form>
  );
}