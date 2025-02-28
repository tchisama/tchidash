"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function Page() {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  }, [router]);
  return <div>page</div>;
}

export default Page;
