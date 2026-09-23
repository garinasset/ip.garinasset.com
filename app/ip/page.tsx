import { Suspense } from "react";

import IpPageClient from "./IpPageClient";

export default function IpPage() {
  return (
    <Suspense fallback={<IpPageLoading />}>
      <div className="mx-auto w-full max-w-[64rem]">
        <IpPageClient />
      </div>
    </Suspense>
  );
}

function IpPageLoading() {
  return (
    <main className="min-h-screen w-full font-[Arial,sans-serif]">
      <div className="mx-auto w-full px-6 max-[600px]:px-4">
        <div className="flex min-h-[200px] items-center justify-center text-[rgb(0,0,153)]">
          ···
        </div>
      </div>
    </main>
  );
}