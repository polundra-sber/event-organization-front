import { http, HttpResponse } from "msw";
import { Event } from "@/lib/api/event-types";
import { LoginRequest, User } from "@/lib/api/auth-types";

// Моковые данные
const mockEvents: Event[] = [
  {
    event_id: 1,
    event_name: "Шашлыки",
    event_description: "Берите пледы и хорошее настроение!",
    event_date: "2025-06-12",
    event_time: "16:00",
    location: "Центральный парк",
    role_name: "организатор",
  },
  {
    event_id: 2,
    event_name: "Кино",
    event_date: "2025-06-15",
    role_name: "участник",
  },
  {
    event_id: 3,
    event_name: "Концерт Кишлака",
    event_date: "2025-01-25",
    role_name: "создатель",
  },
];

export const handlers = [
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

  // Получение мероприятий
  http.get("/api/events", ({ request }) => {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return HttpResponse.json(mockEvents);
  }),
];
