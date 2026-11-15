import Link from "next/link";

import Logo from "@/components/Logo";

interface BrandProps {
  mode: "home" | "query";
}

export default function Brand({ mode }: BrandProps) {
  return (
    <div className={mode === "home" ? "brand-home" : "brand-query"}>
      <Link href="/" title="返回主页">
        <Logo
          role="img"
          aria-label="IP 地理"
          className={
            mode === "home"
              ? "h-[16em] w-[16em] object-contain max-[600px]:h-[7em] max-[600px]:w-[7em]"
              : "h-auto w-[7.5rem] object-contain"
          }
        />
      </Link>
    </div>
  );
}
