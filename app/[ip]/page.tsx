import HomePageContent from "@/components/HomePage";

export default async function Page({
  params,
}: {
  params: Promise<{ ip: string }>;
}) {
  const { ip } = await params;
  return <HomePageContent queryIp={decodeURIComponent(ip)} />;
}
