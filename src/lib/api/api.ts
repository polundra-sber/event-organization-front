import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// 1. Создаем API клиент
export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "/api", // Базовый URL (совпадает с моками)
  }),
  endpoints: (builder) => ({
    // 2. Описываем эндпоинты
    login: builder.mutation<
      { token: string },
      { loginInput: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    register: builder.mutation<
      { token: string },
      { loginInput: string; password: string; email: string }
    >({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

// 3. Экспортируем автоматически сгенерированные хуки
export const { useLoginMutation, useRegisterMutation } = api;
