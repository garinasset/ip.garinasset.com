import Image from "next/image";
import Link from "next/link";

interface BrandProps {
  mode: "home" | "query";
}

export default function Brand({ mode }: BrandProps) {
  return (
    <div className={mode === "home" ? "brand-home" : "brand-query"}>
      <Link href="/" title="返回主页">
        <Image
          src="/images/logo.png"
          alt="IP 地理"
          title="IP 地理 Logo"
          width={256}
          height={256}
          priority
          sizes={mode === "home" ? "(max-width: 600px) 7em, 16em" : "120px"}
          className={
            mode === "home"
              ? "h-auto w-auto max-h-[16em] max-w-[16em] object-contain max-[600px]:max-h-[7em] max-[600px]:max-w-[7em]"
              : "h-auto w-[7.5rem] object-contain"
          }
        />
      </Link>
    </div>
  );
}
