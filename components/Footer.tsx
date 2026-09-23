export default function Footer() {
  return (
    <footer className="px-4 py-16 text-center max-[600px]:py-6">
      <div className="mx-auto flex max-w-[43em] flex-col items-center justify-center">
        <div className="my-1 text-xs leading-[1.125em] text-[rgb(0,0,153)]">

          <a
            href="https://api.garinasset.com/ip/redoc"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2 underline decoration-dashed underline-offset-4"
          >
            API : <strong>免费</strong>
          </a>

          <span>|</span>


          <a
            href="https://db-ip.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2 underline decoration-dashed underline-offset-4"
          >
            数据库 : <strong>DB-IP</strong>
          </a>

          <a
            href="https://www.maxmind.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2 underline decoration-dashed underline-offset-4"
          >
            <strong>GeoLite2</strong>
          </a>

          <span>|</span>

          <a
            href="https://api.garinasset.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2 underline decoration-dashed underline-offset-4"
          >
            应用 & 接口 : <strong>嘉林数据</strong>
          </a>
        </div>
      </div>
    </footer>
  )
}