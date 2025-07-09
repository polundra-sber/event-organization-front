import { api } from "./api";
import {
  CostAllocationListItem,
  UserDemo,
  ReceiptList,
} from "@/lib/api/types/cost-allocation-types";

export const {
  useGetCostAllocationListQuery,
  useLazyGetParticipantsForPurchaseQuery,
  useAddParticipantsForPurchaseMutation,
  useDeleteParticipantsForPurchaseMutation,
  useSendCostAllocationListMutation,
  useGetReceiptsForPurchaseQuery,
} = api.injectEndpoints({
  endpoints: (builder) => ({
    getCostAllocationList: builder.query<
      CostAllocationListItem[],
      number
    >({
      query: (event_id) => ({
        url: `/events/${event_id}/cost-allocation-list`,
        method: "GET",
      }),
      providesTags: (result, error, event_id) => [
        { type: "CostAllocationList", id: event_id },
      ],
    }),

getParticipantsForPurchase: builder.query<
  UserDemo[],
  { event_id: number; purchase_id: number }
>({
  query: ({ event_id, purchase_id }) => ({
    url: `/events/${event_id}/cost-allocation-list/${purchase_id}/participants`,
    method: "GET",
  }),
  providesTags: (result, error, { event_id, purchase_id }) => [
    { type: "Participants", id: `${event_id}-${purchase_id}` },
  ],
}),


    addParticipantsForPurchase: builder.mutation<
      void,
      { event_id: number; purchase_id: number; logins: string[] }
    >({
      query: ({ event_id, purchase_id, logins }) => ({
        url: `/events/${event_id}/cost-allocation-list/${purchase_id}/add-participants`,
        method: "POST",
        body: logins,
      }),
        invalidatesTags: (result, error, { event_id, purchase_id }) => [
          { type: "CostAllocationList", id: event_id }, 

  ],
    }),

    deleteParticipantsForPurchase: builder.mutation<
      void,
      { event_id: number; purchase_id: number; logins: string[] }
    >({
      query: ({ event_id, purchase_id, logins }) => ({
        url: `/events/${event_id}/cost-allocation-list/${purchase_id}/participants`,
        method: "DELETE",
        body: logins,
      }),
        invalidatesTags: (result, error, { event_id, purchase_id }) => [
    { type: "CostAllocationList", id: event_id }, 
  ],
    }),

    sendCostAllocationList: builder.mutation<void, { event_id: number }>({
      query: ({ event_id }) => ({
        url: `/events/${event_id}/cost-allocation-list/send-cost-allocation-list`,
        method: "POST",
      }),
    }),

    getReceiptsForPurchase: builder.query<
      ReceiptList,
      { event_id: number; purchase_id: number }
    >({
      query: ({ event_id, purchase_id }) => ({
        url: `/events/${event_id}/purchases-list/${purchase_id}/get-receipt`,
        method: "GET",
      }),
    }),
  }),
});
