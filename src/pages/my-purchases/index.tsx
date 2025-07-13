"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MyPurchasesPageContent } from "@/components/myPurchases/MyPurchasesPage";
import { Loader } from "@/components/common/Loader";

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
    return <Loader />;
  }

  return <MyPurchasesPageContent />;
}
