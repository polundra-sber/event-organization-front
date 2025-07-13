import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CreateEventPage from "@/components/create-edit-event/CreateEventPage";
import { Loader } from "@/components/common/Loader";

export default function EventsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Добавляем состояние загрузки

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

  return <CreateEventPage />;
}
