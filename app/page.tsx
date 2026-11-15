import { connection } from "next/server";

import HomePageContent from "@/components/HomePage";

export default async function Page() {
  await connection();

  return <HomePageContent />;
}
