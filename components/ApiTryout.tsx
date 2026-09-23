interface ApiTryoutProps {
  ip: string;
  data: unknown;
  loading: boolean;
}

export default function ApiTryout({
  ip,
  data,
  loading,
}: ApiTryoutProps) {
  const apiUrl =
    `https://api.garinasset.com/ip/${ip}`;

  const response =
    loading || !data
      ? ""
      : JSON.stringify(data, null, 2);

  return (
    <div className="mt-[1.25em] w-full max-w-[52rem] box-border">

      {/* ============================== */}
      {/* 试试接口 */}
      {/* ============================== */}

      <h3 className="m-0 mb-[0.5em] text-base font-bold leading-[1.5] text-[rgb(0,0,153)]">
        <a
          href="https://api.garinasset.com/ip/redoc"
          target="_blank"
          rel="noopener noreferrer"
          className="text-inherit underline decoration-dashed decoration-[rgba(0,0,153,0.35)] underline-offset-[0.2em]"
        >
          试试接口
        </a>
      </h3>

      <textarea
        readOnly
        rows={1}
        value={`curl ${apiUrl}`}
        className="min-h-24 sm:min-h-20 md:min-h-8 lg:min-h-8 box-border w-full resize-none overflow-hidden rounded-[0.5em] border border-[#dadce0] bg-white px-[1em] py-[0.875em] font-mono text-[0.9375em] leading-[1.6] text-[rgb(0,0,153)] shadow-[0_0.1875em_0.625em_0_rgba(31,31,31,0.08)] outline-none"
      />

      {/* ============================== */}
      {/* 响应内容 */}
      {/* ============================== */}

      <div className="mt-[1.25em] w-full">
        <h3 className="m-0 mb-[0.5em] text-base font-bold leading-[1.5] text-[rgb(0,0,153)]">
          <a
            href={data ? apiUrl : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-inherit underline decoration-dashed decoration-[rgba(0,0,153,0.35)] underline-offset-[0.2em]"
          >
            响应内容
          </a>
        </h3>

        <textarea
          readOnly
          rows={10}
          value={response}
          className="box-border min-h-104 sm:min-h-72 md:min-h-72 lg:min-h-72 w-full resize-none overflow-hidden rounded-[0.5em] border border-[#dadce0] bg-white px-[1em] py-[0.875em] font-mono text-[0.9375em] leading-[1.6] text-[rgb(0,0,153)] shadow-[0_0.1875em_0.625em_0_rgba(31,31,31,0.08)] outline-none"
        />
      </div>
    </div>
  );
}