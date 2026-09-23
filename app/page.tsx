import HomeSearch from "@/components/HomeSearch";
import HomeIpSummary from "@/components/HomeIpSummary";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="flex min-h-screen w-full flex-col font-[Arial,sans-serif]">
      {/* LOGO */}
      <div className="flex min-h-[5.75em] flex-col items-center pt-[3.75em]">
        <a href="/" title="返回主页">
          <img
            src="/images/logo.png"
            alt="GARINASSET"
            title="GARINASSET Logo"
            className="max-h-[16em] max-w-[16em] object-contain max-[600px]:max-h-[7em] max-[600px]:max-w-[7em]"
          />
        </a>
      </div>

      {/* 搜索框 */}
      <div className="flex w-full flex-col items-center px-4 py-5">
        <HomeSearch />
      </div>

      {/* IP 查询结果 */}
      <HomeIpSummary />

      {/* Footer */}
      <Footer />
    </main>
  );
}