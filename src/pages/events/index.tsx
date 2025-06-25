import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { HomePageContent } from "@/components/events/HomePage";

export default function EventsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Добавляем состояние загрузки
  const Loader = () => (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      setIsLoading(false); // Останавливаем лоадер, если токен есть
    }
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return <HomePageContent />;
}
