import { http, HttpResponse } from "msw";


let mockProfile = {
  firstName: "Анна",
  lastName: "Иванова",
  login: "anna_ivanova",
  password: "••••••••",
  email: "anna@example.com",
  requisites: "Банковская карта: 1234 5678 9012 3456",
};

export const handlers = [
  http.post("/api/auth/login", async ({ request }) => {
    const { loginInput, password } = (await request.json()) as {
      loginInput: string;
      password: string;
    };

    if (loginInput === "test" && password === "12345") {
      return HttpResponse.json({ token: "fake-jwt-token" });
    }
    return HttpResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }),

  http.post("/api/auth/register", async ({ request }) => {
    const { loginInput, password, email } = (await request.json()) as {
      loginInput: string;
      password: string;
      email: string;
    };

    // Проверка на обязательные поля
    if (!loginInput || !password || !email) {
      return HttpResponse.json(
        { error: "Все поля обязательны для заполнения" },
        { status: 400 }
      );
    }

    // Проверка на существующего пользователя
    if (loginInput === "test") {
      return HttpResponse.json(
        {
          error: "Имя пользователя уже занято",
          details: {
            field: "loginInput",
            message: "Попробуйте другое имя пользователя",
          },
        },
        { status: 409 }
      );
    }

    // Проверка email
    if (!email.includes("@")) {
      return HttpResponse.json(
        {
          error: "Некорректный email",
          details: {
            field: "email",
            message: "Введите корректный email адрес",
          },
        },
        { status: 400 }
      );
    }

    // Проверка пароля
    if (password.length < 6) {
      return HttpResponse.json(
        {
          error: "Пароль слишком короткий",
          details: {
            field: "password",
            message: "Пароль должен содержать минимум 6 символов",
          },
        },
        { status: 400 }
      );
    }

    // Здесь была бы реальная логика создания пользователя
    return HttpResponse.json(
      { token: "fake-jwt-token-for-new-user" },
      { status: 201 }
    );
  }),

      // Мок для /api/profile
  http.get("/api/profile", () => {
    return HttpResponse.json(mockProfile);
  }),

  http.patch("/api/profile", async ({ request }) => {
    const updatedData = await request.json();

    // Обновляем мок-профиль
    mockProfile = {
      ...mockProfile,
      ...updatedData
    };

    return HttpResponse.json(mockProfile);
  }),

];
