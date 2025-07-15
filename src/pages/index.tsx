import { LoginForm } from "@/components/auth/LoginForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Loader } from "@/components/common/Loader";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Если токен есть, перенаправляем на /events
      router.push("/events");
    } else {
      // Если токена нет, останавливаем загрузку
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <Loader />;
  }
  return <LoginForm />;
}
