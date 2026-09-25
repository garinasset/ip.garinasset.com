import { SITE_LINKS } from "@/config/siteLinks";

export default function Footer() {
  return (
    <footer className="px-4 py-10 sm:py-12">
      <nav
        aria-label="页脚导航"
        className="mx-auto flex max-w-[43rem] flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-xs leading-5 text-[#000099]"
      >
        {SITE_LINKS.map(({ label, value, href }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap underline decoration-dashed underline-offset-4 hover:decoration-solid"
          >
            {label} : <strong>{value}</strong>
          </a>
        ))}
      </nav>
    </footer>
  );
}
