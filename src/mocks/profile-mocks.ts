// src/mocks/profile-mocks.ts
import { UserProfile, UserEditor } from "@/lib/api/types/profile-types";
import { http, HttpResponse } from "msw";

// Моковые данные профиля
let mockProfile = {
  firstName: "Анна",
  lastName: "Иванова",
  login: "anna_ivanova",
  email: "anna@example.com",
  requisites: "Банковская карта: 1234 5678 9012 3456",
};

export const profileHandlers = [
  // Получение профиля текущего пользователя
  http.get("/api/profile", () => {
    return HttpResponse.json({
      firstName: mockProfile.firstName,
      lastName: mockProfile.lastName,
      login: mockProfile.login,
      email: mockProfile.email,
      requisites: mockProfile.requisites,
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
