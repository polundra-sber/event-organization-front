import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginRequest, User } from "@/lib/api/auth-types";

// 1. Создаем API клиент
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
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

    // Получение мероприятий
    getEvents: builder.query<Event[], void>({
      query: () => "/events",
    }),
  }),
});

// 3. Экспортируем автоматически сгенерированные хуки
export const { useLoginMutation, useRegisterMutation, useGetEventsQuery } = api;
