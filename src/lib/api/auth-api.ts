import { api } from "./api";
import { LoginRequest, User } from "@/lib/api/types/auth-types";

export const { useLoginMutation, useRegisterMutation } = api.injectEndpoints({
  endpoints: (builder) => ({
    // Авторизация
    login: builder.mutation<{ token: string }, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Регистрация
    register: builder.mutation<{ token: string }, User>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
  }),
});
