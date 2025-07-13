"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/lib/api/auth-api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  validateLogin,
  ValidationResult,
} from "@/lib/validation/auth-validation";

const validatePassword = (password: string): ValidationResult => {
  if (!password.trim()) return { valid: false, message: "Пароль обязателен" };
  return { valid: true };
};

const RequiredFieldLabel = ({ text }: { text: string }) => (
  <div className="flex items-center gap-1">
    <span>{text}</span>
    <span className="text-red-500 font-bold">*</span>
  </div>
);

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [loginUser, { isLoading }] = useLoginMutation();
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setServerError(null);

    if (touchedFields[id]) {
      validateField(id, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (!touchedFields[id]) {
      setTouchedFields((prev) => ({ ...prev, [id]: true }));
    }
    validateField(id, value);
  };

  const validateField = (fieldId: string, value: string): boolean => {
    let result: ValidationResult = { valid: true };

    switch (fieldId) {
      case "login":
        result = validateLogin(value);
        break;
      case "password":
        result = validatePassword(value);
        break;
    }

    if (!result.valid) {
      setFieldErrors((prev) => ({ ...prev, [fieldId]: result.message || "" }));
      return false;
    } else {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
      return true;
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;

    if (!validateField("login", formData.login)) isValid = false;
    if (!validateField("password", formData.password)) isValid = false;

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const allFieldsTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);

    setTouchedFields(allFieldsTouched);

    if (!validateForm()) {
      return;
    }

    try {
      const result = await loginUser(formData).unwrap();
      localStorage.setItem("token", result.token);
      router.push("/events");
    } catch (err: any) {
      console.error("Login failed:", err);
      setServerError(
        err?.data?.error ||
          "Ошибка входа. Пожалуйста, проверьте данные и попробуйте снова."
      );
    }
  };

  return (
    <div className="flex flex-col justify-center p-4 sm:p-6 min-h-[calc(100vh-100px)]">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-md mx-auto space-y-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-gray-900">С возвращением</h1>
          <p className="text-gray-500 text-sm">Войдите в свою учетную запись</p>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="login" className="text-gray-700">
              <RequiredFieldLabel text="Логин" />
            </Label>
            <Input
              id="login"
              type="text"
              value={formData.login}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ваш логин"
              className="h-11"
            />
            {fieldErrors.login && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.login}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-700">
              <RequiredFieldLabel text="Пароль" />
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="••••••••"
              className="h-11"
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>
        </div>

        {serverError && (
          <p className="text-red-500 text-sm text-center py-1">{serverError}</p>
        )}

        <Button
          variant="default"
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
