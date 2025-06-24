import { http, HttpResponse } from "msw";

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
];
