"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/lib/api";
import Link from "next/link";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, isError }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      localStorage.setItem("token", result.token);
      window.location.href = "/events";
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center p-6 min-h-[80vh]">
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
            <Label htmlFor="email" className="text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="h-11"
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-700">
              Password
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
