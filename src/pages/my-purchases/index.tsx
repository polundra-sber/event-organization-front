"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MyPurchasesPageContent } from "@/components/myPurchases/MyPurchasesPage";

export default function MyPurchasesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return <MyPurchasesPageContent />;
}
