"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MyIncomesPageContent } from "@/components/myIncomes/MyIncomesPage";
import { Loader } from "@/components/common/Loader";

export default function MyIncomesPage() {
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

  return <MyIncomesPageContent />;
}
