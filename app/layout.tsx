import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IP 地理 - 嘉林数据",
  description:
    "IP 地理，可快速查询 IP 地址 所在国家、城市、经纬度、ISP、ASN、ASO 信息。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="apple-mobile-web-app-title" content="IP 地理" />
      </head>
      <body>{children}</body>
    </html>
  );
}