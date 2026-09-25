import { SITE_LINKS } from "@/components/siteLinks";

export default function Navigation() {
  return (
    <nav
      data-flip="navigation"
      aria-label="网站导航"
      className="hidden items-center text-xs leading-[18px] text-[#000099] lg:flex lg:flex-wrap"
    >
      {SITE_LINKS.map((item, index) => (
        <span key={item.href} className="flex items-center">
          {index > 0 && <span className="mx-1.5 select-none">|</span>}
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-dashed underline-offset-4 hover:decoration-solid"
          >
            {item.label} : <strong>{item.value}</strong>
          </a>
        </span>
      ))}
    </nav>
  );
}
