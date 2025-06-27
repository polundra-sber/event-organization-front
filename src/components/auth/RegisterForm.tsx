"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterMutation } from "@/lib/api/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    login: "",
    email: "",
    password: "",
    name: "",
    surname: "",
    comment_money_transfer: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [register, { isLoading, isError, error }] = useRegisterMutation();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      const result = await register(formData).unwrap();
      localStorage.setItem("token", result.token);
      router.push("/events");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="flex flex-col justify-center p-6 min-h-[80vh]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto space-y-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Создать аккаунт</h1>
          <p className="text-gray-500 text-sm">
            Заполните форму для регистрации
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="name" className="text-gray-700">
              Имя
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ваше имя"
              className="h-11"
              required
              minLength={1}
              maxLength={20}
            />
          </div>

          <div>
            <Label htmlFor="surname" className="text-gray-700">
              Фамилия
            </Label>
            <Input
              id="surname"
              type="text"
              value={formData.surname}
              onChange={handleChange}
              placeholder="Ваша фамилия"
              className="h-11"
              required
              minLength={1}
              maxLength={50}
            />
          </div>

          <div>
            <Label htmlFor="login" className="text-gray-700">
              Логин
            </Label>
            <Input
              id="login"
              type="text"
              value={formData.login}
              onChange={handleChange}
              placeholder="Придумайте логин"
              className="h-11"
              required
              minLength={3}
              maxLength={20}
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ваш email"
              className="h-11"
              required
              minLength={1}
              maxLength={254}
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-700">
              Пароль
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="h-11"
              required
              minLength={8}
              maxLength={20}
            />
          </div>

          <div>
            <Label htmlFor="comment_money_transfer" className="text-gray-700">
              Реквизиты для переводов (необязательно)
            </Label>
            <Input
              id="comment_money_transfer"
              type="text"
              value={formData.comment_money_transfer}
              onChange={handleChange}
              placeholder="Например: Сбербанк 1234 5678 9012 3456"
              className="h-11"
              maxLength={254}
            />
          </div>
        </div>

        {isError && (
          <p className="text-red-500 text-sm text-center py-1">
            {error && "data" in error
              ? (error.data as { error?: string }).error || "Ошибка регистрации"
              : "Ошибка регистрации. Пожалуйста, попробуйте снова."}
          </p>
        )}

        <Button type="submit" className="w-full h-11" disabled={isLoading}>
          {isLoading ? "Регистрация..." : "Зарегистрироваться"}
        </Button>
      </form>

      <div className="text-center mt-6 text-sm text-gray-600">
        Уже есть аккаунт?{" "}
        <Link
          href="/"
          className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
        >
          Войти
        </Link>
      </div>
    </div>
  );
};
