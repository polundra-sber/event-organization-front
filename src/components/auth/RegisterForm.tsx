"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterMutation } from "@/lib/api/auth-api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  validateName,
  validateSurname,
  validateLogin,
  validateEmail,
  validatePassword,
  validateMoneyTransfer,
  ValidationResult,
} from "@/lib/validation/auth-validation";

const RequiredFieldLabel = ({ text }: { text: string }) => (
  <div className="flex items-center gap-1">
    <span>{text}</span>
    <span className="text-red-500 font-bold">*</span>
  </div>
);

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
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [register, { isLoading }] = useRegisterMutation();
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
      case "name":
        result = validateName(value);
        break;
      case "surname":
        result = validateSurname(value);
        break;
      case "login":
        result = validateLogin(value);
        break;
      case "email":
        result = validateEmail(value);
        break;
      case "password":
        result = validatePassword(value);
        break;
      case "comment_money_transfer":
        result = validateMoneyTransfer(value);
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

    if (!validateField("name", formData.name)) isValid = false;
    if (!validateField("surname", formData.surname)) isValid = false;
    if (!validateField("login", formData.login)) isValid = false;
    if (!validateField("email", formData.email)) isValid = false;
    if (!validateField("password", formData.password)) isValid = false;
    if (
      !validateField("comment_money_transfer", formData.comment_money_transfer)
    )
      isValid = false;

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
      const dataToSend = {
        ...formData,
        comment_money_transfer:
          formData.comment_money_transfer.trim() === ""
            ? null
            : formData.comment_money_transfer,
      };

      const result = await register(dataToSend).unwrap();
      localStorage.setItem("token", result.token);
      router.push("/events");
    } catch (err: any) {
      console.error("Registration failed:", err);
      setServerError(
        err?.data?.error || "Ошибка регистрации. Пожалуйста, попробуйте снова."
      );
    }
  };

  return (
    <div className="flex flex-col justify-center p-6 min-h-[80vh]">
      <form
        onSubmit={handleSubmit}
        noValidate
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
              <RequiredFieldLabel text="Имя" />
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ваше имя"
              className="h-11"
            />
            {fieldErrors.name && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="surname" className="text-gray-700">
              <RequiredFieldLabel text="Фамилия" />
            </Label>
            <Input
              id="surname"
              type="text"
              value={formData.surname}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ваша фамилия"
              className="h-11"
            />
            {fieldErrors.surname && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.surname}</p>
            )}
          </div>

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
              placeholder="Придумайте логин"
              className="h-11"
            />
            {fieldErrors.login && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.login}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-700">
              <RequiredFieldLabel text="Email" />
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ваш email"
              className="h-11"
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
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

          <div>
            <Label htmlFor="comment_money_transfer" className="text-gray-700">
              Реквизиты для переводов
            </Label>
            <Input
              id="comment_money_transfer"
              type="text"
              value={formData.comment_money_transfer}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Например: Сбербанк 1234 5678 9012 3456"
              className="h-11"
            />
            {fieldErrors.comment_money_transfer && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.comment_money_transfer}
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
