"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/lib/api/auth-api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const router = useRouter();

  // Проверка авторизации при загрузке компонента
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/events");
    }
  }, [router]);

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, { isLoading, isError, error }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await loginUser({ login, password }).unwrap();
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
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Ваш логин"
              className="h-11"
              required
              minLength={3}
              maxLength={20}
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
              required
              minLength={8}
              maxLength={20}
            />
          </div>
        </div>

        {isError && (
          <p className="text-red-500 text-sm text-center py-1">
            {error && "data" in error
              ? (error.data as { error?: string }).error ||
                "Неверный логин или пароль"
              : "Неверный логин или пароль"}
          </p>
        )}

        <Button
          variant="pink"
          type="submit"
          className="w-full h-11"
          disabled={isLoading}
        >
          {isLoading ? "Вход..." : "Войти"}
        </Button>
      </form>

      <div className="text-center mt-6 text-sm text-gray-600">
        Нет учетной записи?{" "}
        <Link
          href="/register"
          className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
        >
          Зарегистрироваться
        </Link>
      </div>
    </div>
  );
};
