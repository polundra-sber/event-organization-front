// src/mocks/profile-mocks.ts
import { UserProfile, UserEditor } from "@/lib/api/types/profile-types";
import { http, HttpResponse } from "msw";

// Моковые данные профиля
let mockProfile = {
  name: "Анна",
  surname: "Иванова",
  login: "anna_ivanova",
  email: "anna@example.com",
  comment_money_transfer: "Банковская карта: 1234 5678 9012 3456",
};

export const profileHandlers = [
  // Получение профиля текущего пользователя
  http.get("/api/profile", () => {
    return HttpResponse.json({
      name: mockProfile.name,
      surname: mockProfile.surname,
      login: mockProfile.login,
      email: mockProfile.email,
      comment_money_transfer: mockProfile.comment_money_transfer,
    });
  }),

  http.patch("/api/profile", async ({ request }) => {
    const updatedData = await request.json();

    if (updatedData.email && updatedData.email === "existing@example.com") {
      return HttpResponse.json(
        { error: "Пользователь с такой почтой уже существует" },
        { status: 409 }
      );
    }

    mockProfile = {
      ...mockProfile,
      ...updatedData,
    };

    return HttpResponse.json(updatedData, { status: 201 });
  }),
];
