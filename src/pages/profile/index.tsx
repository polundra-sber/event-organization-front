import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ProfilePageContent } from "@/components/profile/ProfilePage";
import Link from "next/link";

export default function ProfilePage() {
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

  return <ProfilePageContent />;
}
