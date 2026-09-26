import { SITE_LINKS } from "@/config/siteLinks";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mx-auto flex flex-wrap items-center justify-center gap-x-3.5 gap-y-2 text-center text-xs leading-5 text-[#000099]">
      {SITE_LINKS.map(({ label, value, href }) => {
        const isInternal = href.startsWith("/");

        return (
          <Link
            key={href}
            href={href}
            {...(!isInternal && {
              target: "_blank",
              rel: "noopener noreferrer",
            })}
            className="whitespace-nowrap underline decoration-dashed underline-offset-4 hover:decoration-solid"
          >
            {label ? (
              <>
                {label} : <strong>{value}</strong>
              </>
            ) : (
              <strong>{value}</strong>
            )}
          </Link>
        );
      })}
    </footer>
  );
}