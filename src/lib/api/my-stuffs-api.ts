import { api } from "./api";
import { MyStuffListItem } from "@/lib/api/types/my-stuff-types";

export const myStuffApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyStuffsList: builder.query<MyStuffListItem[], void>({
      query: () => `/events/my-stuffs-list`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ stuff_id }) => ({
                type: "MyStuff" as const,
                id: stuff_id,
              })),
              { type: "MyStuff", id: "LIST" },
            ]
          : [{ type: "MyStuff", id: "LIST" }],
    }),

    denyStuffInMyStuffsList: builder.mutation<
      void,
      { event_id: number; stuff_id: number }
    >({
      query: ({ event_id, stuff_id }) => ({
        url: `/events/${event_id}/my-stuffs-list/${stuff_id}/deny-stuff`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { stuff_id }) => [
        { type: "MyStuff", id: stuff_id },
        { type: "MyStuff", id: "LIST" },
      ],
    }),
  }),
});

export const { useGetMyStuffsListQuery, useDenyStuffInMyStuffsListMutation } =
  myStuffApi;

export const { updateQueryData } = myStuffApi.util;
