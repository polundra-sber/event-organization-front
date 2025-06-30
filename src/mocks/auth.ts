import { http, HttpResponse } from "msw";
import { LoginRequest, User } from "@/lib/api/types/auth-types";

export const authHandlers = [
  // Авторизация
  http.post("/api/auth/login", async ({ request }) => {
    const { login, password } = (await request.json()) as LoginRequest;

    if (login === "test" && password === "12345678") {
      return HttpResponse.json({ token: "fake-jwt-token" }, { status: 201 });
    }
    return HttpResponse.json(
      { error: "Неверный логин или пароль" },
      { status: 401 }
    );
  }),

  // Регистрация
  http.post("/api/auth/register", async ({ request }) => {
    const userData = (await request.json()) as User;

    // Проверка на обязательные поля
    if (
      !userData.login ||
      !userData.email ||
      !userData.name ||
      !userData.surname
    ) {
      return HttpResponse.json(
        { error: "Все обязательные поля должны быть заполнены" },
        { status: 400 }
      );
    }

    // Проверка на существующего пользователя
    if (userData.login === "test") {
      return HttpResponse.json(
        {
          error:
            "Пользователь с таким логином уже существует. Пользователь с такой почтой уже существует",
        },
        { status: 409 }
      );
    }

    if (userData.email === "test@mail.com") {
      return HttpResponse.json(
        {
          error: "Пользователь с такой почтой уже существует",
        },
        { status: 409 }
      );
    }

    return HttpResponse.json(
      { token: "fake-jwt-token-for-new-user" },
      { status: 201 }
    );
  }),
];
