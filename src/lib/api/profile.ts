import { api } from "./api";
import { UserProfile, UserEditor } from "@/lib/api/types/profile-types";

// 1. Создаем API клиент
export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // 2. Описываем эндпоинты

    getProfile: builder.query<UserProfile, void>({
      query: () => "/profile",
    }),

    updateProfile: builder.mutation<UserEditor, Partial<UserEditor>>({
      query: (updatedData) => ({
        url: "/profile",
        method: "PATCH",
        body: updatedData,
      }),
    }),
  }),
});


// Экспортируем хуки
export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
} = profileApi;

// 3. Экспортируем автоматически сгенерированные хуки

export const { updateQueryData } = profileApi.util;