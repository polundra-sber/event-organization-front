import { useEffect } from "react";
import { useRouter } from "next/router";

export default function EventsPage() {
  const router = useRouter();

  useEffect(() => {
    // Проверяем токен при загрузке страницы
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/"); // Перенаправляем на вход
    }
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Ваши мероприятия</h1>
      <p>Здесь будет список...</p>
    </div>
  );
}
