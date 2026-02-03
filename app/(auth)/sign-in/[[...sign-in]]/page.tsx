"use client";

import dynamic from "next/dynamic";

const SignIn = dynamic(() => import("@clerk/nextjs").then((m) => m.SignIn), {
  ssr: false,
});

export default function Page() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4 py-10">
      <SignIn />
    </div>
  );
}
