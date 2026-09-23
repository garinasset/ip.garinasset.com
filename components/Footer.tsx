export default function Footer() {
  return (
    <footer className="px-4 py-16 text-center max-[600px]:py-6">
      <div className="mx-auto flex max-w-[43em] flex-col items-center justify-center">
        <div className="my-1 text-xs leading-[1.125em] text-[rgb(0,0,153)]">
          <a
            href="https://api.garinasset.com/ip/redoc"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-dashed decoration-[rgba(0,0,153,.45)] underline-offset-4 hover:decoration-solid"
          >
            <span>API : </span>
            <span className="font-bold">
              免费
            </span>
          </a>

          <span> | </span>

          <a
            href="https://www.maxmind.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-dashed decoration-[rgba(0,0,153,.45)] underline-offset-4 hover:decoration-solid"
          >
            <span>数据库 : </span>
            <span className="font-bold">
              GeoLite2
            </span>
          </a>

          <span> | </span>

          <a
            href="https://api.garinasset.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-dashed decoration-[rgba(0,0,153,.45)] underline-offset-4 hover:decoration-solid"
          >
            <span>应用 & 接口 : </span>
            <span className="font-bold">
              嘉林数据
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}