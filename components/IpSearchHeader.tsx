"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import {
  getIpSpecialType,
  isValidIpAddress,
} from "@/lib/ip";

interface IpSearchHeaderProps {
  initialIp?: string;
}

const MENU_LINKS = [
  {
    label: "首页",
    href: "/",
    external: false,
  },
  {
    label: (
      <>
        API : <strong>免费</strong>
      </>
    ),
    href: "https://api.garinasset.com/ip/redoc",
    external: true,
  },
  {
    label: (
      <>
        CC BY 4.0 : <strong>DB-IP</strong>
      </>
    ),
    href: "https://db-ip.com/",
    external: true,
  },
  {
    label: (
      <>
        CC BY-SA 4.0 : <strong>GeoLite2</strong>
      </>
    ),
    href: "https://www.maxmind.com/",
    external: true,
  },
  {
    label: (
      <>
        MIT : <strong>China Operator IP</strong>
      </>
    ),
    href: "https://china-operator-ip.yfgao.com/",
    external: true,
  },
  {
    label: (
      <>
        应用 & 接口 : <strong>嘉林数据</strong>
      </>
    ),
    href: "https://api.garinasset.com",
    external: true,
  },
];

export default function IpSearchHeader({
  initialIp = "",
}: IpSearchHeaderProps) {
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState(initialIp);
  const [placeholder, setPlaceholder] = useState("输入 IP 地址");
  const [error, setError] = useState(false);

  useEffect(() => {
    setValue(initialIp);
  }, [initialIp]);

  /**
   * 搜索框获得焦点时自动全选
   */
  function selectInput() {
    inputRef.current?.select();
  }

  function showError(message: string) {
    setError(true);

    const oldValue = value;

    setValue("");
    setPlaceholder(message);

    setTimeout(() => {
      setValue(oldValue);

      requestAnimationFrame(() => {
        inputRef.current?.select();
      });
    }, 600);
  }

  function handleInput(nextValue: string) {
    setValue(nextValue);
    setError(false);
    setPlaceholder("输入 IP 地址");
  }

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

    router.push(`/ip?ip=${encodeURIComponent(inputValue)}`);
  }

  return (
    <header className="w-full px-4 py-6">
      <div
        className="
          mx-auto
          grid
          w-full
          max-w-5xl
          grid-cols-1
          gap-5

          lg:grid-cols-[7.5rem_minmax(0,1fr)]
          lg:grid-rows-auto
          lg:gap-x-8
          lg:gap-y-1
        "
      >
        {/* ================================================== */}
        {/* Logo
            手机 / iPad：第一行
            PC：左侧，跨两行
        */}
        {/* ================================================== */}

        <div
          className="
            flex
            justify-center

            lg:row-span-2
            lg:items-start
            lg:justify-center
          "
        >
          <Link href="/" title="返回主页">
            <Image
              src="/images/logo.png"
              alt="IP 地理"
              title="IP 地理 Logo"
              width={120}
              height={120}
              priority
              className="
                h-auto
                w-[7.5rem]
                object-contain
              "
            />
          </Link>
        </div>

        {/* ================================================== */}
        {/* 菜单
            手机：隐藏
            iPad：隐藏
            PC：显示
        */}
        {/* ================================================== */}

        <nav
          aria-label="网站导航"
          className="
            hidden
            items-center
            text-xs
            leading-[18px]
            text-[#000099]

            lg:flex
            lg:flex-wrap
          "
        >
          {MENU_LINKS.map((item, index) => (
            <span
              key={item.href}
              className="flex items-center"
            >
              {index > 0 && (
                <span className="mx-1.5 select-none">
                  |
                </span>
              )}

              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    underline
                    decoration-dashed
                    underline-offset-4
                    hover:decoration-solid
                  "
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  href={item.href}
                  className="
                    font-bold
                    underline
                    decoration-dashed
                    underline-offset-4
                    hover:decoration-solid
                  "
                >
                  {item.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* ================================================== */}
        {/* 搜索
            手机 / iPad：第二行，一列
            PC：右侧第二行，横向排列
        */}
        {/* ================================================== */}

        <form
          onSubmit={submit}
          noValidate
          className="
            flex
            w-full
            min-w-0
            flex-col
            items-center
            gap-3

            lg:flex-row
            lg:items-center
            lg:gap-2.5
          "
        >
          {/* 搜索框 */}

          <input
            ref={inputRef}
            value={value}
            onChange={(e) => handleInput(e.target.value)}
            onFocus={selectInput}
            title="搜索"
            placeholder={placeholder}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            inputMode="text"
            enterKeyHint="search"
            className={[
              "h-[3.125em] w-full min-w-0",
              "rounded-[1.625em]",
              "border bg-white px-3",
              "text-base text-[rgba(0,0,0,.87)]",
              "outline-none",
              "shadow-[0_0.1875em_0.625em_0_rgba(31,31,31,.08)]",
              "placeholder:text-[#9aa0a6]",
              "transition",
              "focus:border-[#4285f4]",

              error
                ? "border-[#d93025] shadow-[0_0_0.25em_rgba(217,48,37,.6)]"
                : "border-[#dadce0]",

              "lg:flex-1",
            ].join(" ")}
          />

          {/* 查询按钮 */}

          <button
            type="submit"
            className="
              h-[3.125em]
              w-24
              shrink-0
              rounded-xl
              border border-[#f8f9fa]
              bg-[#f8f9fa]
              px-4
              text-sm
              font-medium
              text-[#3c4043]
              shadow-[0_0.1875em_0.625em_0_rgba(31,31,31,.08)]
              transition

              hover:border-[#dadce0]
              hover:text-[#202124]

              focus:border-[#4285f4]
              focus:outline-none
            "
          >
            查询
          </button>
        </form>
      </div>
    </header>
  );
}