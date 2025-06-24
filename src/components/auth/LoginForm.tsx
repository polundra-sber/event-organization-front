"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/lib/api/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, isError }] = useLoginMutation();
  const router = useRouter();

  // Проверка авторизации при загрузке компонента
  /*useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/events");
    }
  }, [router]);
  */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await login({ loginInput, password }).unwrap();
      localStorage.setItem("token", result.token);
      router.push("/events");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center p-4 sm:p-6 min-h-[calc(100vh-100px)]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto space-y-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-gray-900">С возвращением</h1>
          <p className="text-gray-500 text-sm">Войдите в свою учетную запись</p>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="login" className="text-gray-700">
              Логин
            </Label>
            <Input
              id="login"
              type="login"
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              placeholder="Ваш логин"
              className="h-11"
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-700">
              Пароль
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11"
            />
          </div>
        </div>

        {isError && (
          <p className="text-red-500 text-sm text-center py-1">
            Неверные учетные данные. Пожалуйста, попробуйте снова.
          </p>
        )}

        <Button type="submit" className="w-full h-11" disabled={isLoading}>
          {isLoading ? "Вход..." : "Войти"}
        </Button>
      </form>

      <div className="text-center mt-6 text-sm text-gray-600">
        Нет учетной записи?{" "}
        <Link href="/register" className="text-blue-600 font-medium">
          Зарегистрироваться
        </Link>
      </div>
    </div>
  );
};
