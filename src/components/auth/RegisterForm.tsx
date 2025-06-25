"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterMutation } from "@/lib/api/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ApiError, RegisterRequest } from "@/lib/api/auth-types";

export const RegisterForm = () => {
  const [formData, setFormData] = useState<RegisterRequest>({
    loginInput: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
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
      const error = err as ApiError;
      console.error("Registration failed:", error);

      if (error.data?.details) {
        setFieldErrors({
          [error.data.details.field]: error.data.details.message,
        });
      }
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
            <Label htmlFor="firstName" className="text-gray-700">
              Имя
            </Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Ваше имя"
              className="h-11"
              required
            />
            {fieldErrors.firstName && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.firstName}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName" className="text-gray-700">
              Фамилия
            </Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Ваша фамилия"
              className="h-11"
              required
            />
            {fieldErrors.lastName && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.lastName}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="loginInput" className="text-gray-700">
              Логин
            </Label>
            <Input
              id="loginInput"
              type="text"
              value={formData.loginInput}
              onChange={handleChange}
              placeholder="Придумайте логин"
              className="h-11"
              required
            />
            {fieldErrors.loginInput && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.loginInput}
              </p>
            )}
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
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
            )}
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
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>
        </div>

        {isError && (
          <p className="text-red-500 text-sm text-center py-1">
            {error && "data" in error
              ? (error.data as { error: string }).error
              : "Ошибка регистрации. Пожалуйста, попробуйте снова."}
          </p>
        )}

        <Button variant = "pink" type="submit" className="w-full h-11" disabled={isLoading}>
          {isLoading ? "Регистрация..." : "Зарегистрироваться"}
        </Button>
      </form>

      <div className="text-center mt-6 text-sm text-gray-600">
        Уже есть аккаунт?{" "}
        <Link href="/" className="text-blue-600 font-medium">
          Войти
        </Link>
      </div>
    </div>
  );
};
