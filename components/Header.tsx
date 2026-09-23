import Link from "next/link"

export default function Header() {
  return (
    <div className="shrink-0">
      <div className="flex min-h-[5.75em] flex-col items-center pt-[3.75em] max-[600px]:min-h-[4em] max-[600px]:pt-[2.5em]">
        <Link href="/" title="返回主页">
          <img
            className="max-h-[16em] max-w-[16em] object-contain max-[600px]:max-h-[7em] max-[600px]:max-w-[15em]"
            src="/images/logo.png"
            alt="GARINASSET"
            title="GARINASSET Logo"
          />
        </Link>
      </div>
    </div>
  )
}