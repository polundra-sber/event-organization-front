import { UserProfile } from "@/lib/api/types/profile-types";
import { http, HttpResponse } from "msw";

let mockProfile: UserProfile = {
  name: "Анна",
  surname: "Иванова",
  login: "anna_ivanova",
  email: "anna@example.com",
  comment_money_transfer: "Банковская карта: 1234 5678 9012 3456",
};

export const profileHandlers = [
  http.get("/api/profile", () => {
    return HttpResponse.json(mockProfile);
  }),

  http.patch("/api/profile", async ({ request }) => {
    const updatedProfile = await request.json() as UserProfile;

    if (updatedProfile.email === "existing@example.com") {
      return HttpResponse.json(
        { error: "Пользователь с такой почтой уже существует" },
        { status: 409 }
      );
    }

    mockProfile = { ...updatedProfile };

    return HttpResponse.json(mockProfile, { status: 200 });
  }),
];
