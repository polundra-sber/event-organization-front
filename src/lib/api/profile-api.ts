import { api } from "./api";
import { UserProfile } from "@/lib/api/types/profile-types";

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      query: () => "/profile",
    }),

    updateProfile: builder.mutation<UserProfile, UserProfile>({
      query: (updatedProfile) => ({
        url: "/profile",
        method: "PATCH",
        body: updatedProfile,
      }),
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
export const { updateQueryData } = profileApi.util;
