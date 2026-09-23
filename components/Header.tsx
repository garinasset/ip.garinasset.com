import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="shrink-0">
      <div className="flex min-h-[5.75em] flex-col items-center pt-[3.75em] max-[600px]:min-h-[4em] max-[600px]:pt-[2.5em]">
        <Link href="/" title="返回主页">
          <Image
            src="/images/logo.png"
            alt="IP 地理"
            title="IP 地理 Logo"
            width={256}
            height={256}
            sizes="(max-width: 600px) 15em, 16em"
            priority
            className="h-auto w-auto max-h-[16em] max-w-[16em] object-contain max-[600px]:max-h-[7em] max-[600px]:max-w-[15em]"
          />
        </Link>
      </div>
    </div>
  );
}