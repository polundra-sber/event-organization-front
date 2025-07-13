import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: (headers) => {
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

  if (result.error?.status === 401) {
    localStorage.removeItem("token");
    toast.error("Сессия истекла. Пожалуйста, войдите снова");
    window.location.href = "/";
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuthCheck, // Используем модифицированный baseQuery
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
