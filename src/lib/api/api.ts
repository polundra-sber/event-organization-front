import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { endpoint }) => {
    // Не добавляем токен для эндпоинтов входа и регистрации
    if (endpoint === "login" || endpoint === "register") {
      return headers;
    }

    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithAuthCheck: BaseQueryFn<
  string | FetchArgs,
  unknown,
  unknown
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // Определяем, является ли запрос auth-запросом
  const isAuthRequest =
    typeof args !== "string" &&
    (args.url?.endsWith("/auth/login") || args.url?.endsWith("/auth/register"));

  // Обрабатываем общую 401 только для НЕ auth-запросов
  if (result.error?.status === 401 && !isAuthRequest) {
    localStorage.removeItem("token");
    toast.error("Сессия истекла. Пожалуйста, войдите снова");
    window.location.href = "/";
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuthCheck,
  tagTypes: [
    "Event",
    "MyStuff",
    "MyTask",
    "MyDebt",
    "MyIncome",
    "MyPurchases",
    "TaskList",
    "ParticipantsList",
    "StuffList",
    "PurchaseList",
    "CostAllocationList",
    "Participants",
    "CostList",
  ],
  refetchOnMountOrArgChange: true, // отключение кэширования при переходе между вкладками
  endpoints: () => ({}),
});

// Экспортируем автоматически сгенерированные хуки
export default api;
