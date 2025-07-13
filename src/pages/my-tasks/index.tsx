"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MyTasksPageContent } from "@/components/myTasks/MyTasksPage";
import { Loader } from "@/components/common/Loader";

export default function MyTasksPage() {
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

  return <MyTasksPageContent />;
}
