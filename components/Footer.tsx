const links = [
  {
    label: "API",
    value: "免费",
    href: "https://api.garinasset.com/ip/redoc",
  },
  {
    label: " CC BY 4.0",
    value: "DB-IP",
    href: "https://db-ip.com/",
  },
  {
    label: "CC BY-SA 4.0",
    value: "GeoLite2",
    href: "https://www.maxmind.com/",
  },
  {
    label: "应用 & 接口",
    value: "嘉林数据",
    href: "https://api.garinasset.com",
  },
]

export default function Footer() {
  return (
    <footer className="px-4 py-10 sm:py-12">
      <nav
        aria-label="页脚导航"
        className="mx-auto flex max-w-[43rem] flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-xs leading-5 text-[#000099]"
      >
        {links.map(({ label, value, href }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap underline decoration-dashed underline-offset-4 hover:decoration-solid"
          >
            {label && `${label} : `}
            <strong>{value}</strong>
          </a>
        ))}
      </nav>
    </footer>
  )
}