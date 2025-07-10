import { api } from "./api";
import {
  StuffListItem,
  StuffListItemCreator,
  StuffListItemEditor,
  StuffListItemResponsible,
} from "@/lib/api/types/stuffs-types";

export const {
  useGetStuffsListQuery,
  useAddStuffToStuffsListMutation,
  useEditStuffInStuffsListMutation,
  useDeleteStuffFromStuffsListMutation,
  useTakeStuffFromStuffsListMutation,
} = api.injectEndpoints({
  endpoints: (builder) => ({
    getStuffsList: builder.query<StuffListItem[], number>({
      query: (event_id) => ({
        url: `/events/${event_id}/stuffs-list`,
        method: "GET",
      }),
      providesTags: (result, error, event_id) => [
        { type: "StuffList", id: event_id },
      ],
    }),

    addStuffToStuffsList: builder.mutation<
      StuffListItem,
      { event_id: number; stuffData: StuffListItemCreator }
    >({
      query: ({ event_id, stuffData }) => ({
        url: `/events/${event_id}/stuffs-list/add-stuff`,
        method: "POST",
        body: stuffData,
      }),
      invalidatesTags: (result, error, { event_id }) => [
        { type: "StuffList", id: event_id },
      ],
    }),

    editStuffInStuffsList: builder.mutation<
      StuffListItem,
      { event_id: number; stuff_id: number; stuffData: StuffListItemEditor }
    >({
      query: ({ event_id, stuff_id, stuffData }) => ({
        url: `/events/${event_id}/stuffs-list/${stuff_id}/edit-stuff`,
        method: "PATCH",
        body: stuffData,
      }),
      invalidatesTags: (result, error, { event_id }) => [
        { type: "StuffList", id: event_id },
      ],
    }),

    deleteStuffFromStuffsList: builder.mutation<
      void,
      { event_id: number; stuff_id: number }
    >({
      query: ({ event_id, stuff_id }) => ({
        url: `/events/${event_id}/stuffs-list/${stuff_id}/delete-stuff`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { event_id }) => [
        { type: "StuffList", id: event_id },
      ],
    }),

    takeStuffFromStuffsList: builder.mutation<
      StuffListItemResponsible,
      { event_id: number; stuff_id: number }
    >({
      query: ({ event_id, stuff_id }) => ({
        url: `/events/${event_id}/stuffs-list/${stuff_id}/take-stuff`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { event_id }) => [
        { type: "StuffList", id: event_id },
      ],
    }),
  }),
});
