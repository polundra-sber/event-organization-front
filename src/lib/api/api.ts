import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Создаем API клиент
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
  tagTypes: [
    "Event",
    "MyStuff",
    "MyTask",
    "MyDebt",
    "MyIncomes",
    "TaskList",
    "ParticipantsList",
  ],
  endpoints: () => ({}),
});

// Экспортируем автоматически сгенерированные хуки
export default api;
