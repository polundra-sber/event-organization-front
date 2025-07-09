import { api } from "./api";
import {
  CostAllocationListItem,
  CostListResponse,
  UserDemo,
  ReceiptList,
  EventNotExistResponse
} from "@/lib/api/types/cost-types";

export const costListApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Получить список расходов
    getCostList: builder.query<CostListResponse, number>({
      query: (event_id) => `/events/${event_id}/cost-list`,
      providesTags: ["CostList"],
    }),

    // Получить персональный список расходов
    getPersonalCostList: builder.query<CostAllocationListItem[], number>({
      query: (event_id) => `/events/${event_id}/cost-list-personal`,
      providesTags: ["CostList"],
    }),

    // Получить участников для покупки
    getParticipantsForPurchase: builder.query<UserDemo[], { 
      event_id: number; 
      purchase_id: number 
    }>({
      query: ({ event_id, purchase_id }) => 
        `/events/${event_id}/cost-list/${purchase_id}/participants`,
    }),

    // Получить чек покупки
    getReceiptForPurchase: builder.query<ReceiptList, { 
      event_id: number; 
      purchase_id: number 
    }>({
      query: ({ event_id, purchase_id }) => ({
        url: `/events/${event_id}/purchases-list/${purchase_id}/get-receipt`,
        responseHandler: (response) => response.formData(),
      }),
      transformResponse: async (formData: FormData) => {
        const files = formData.getAll('files') as File[];
        return { files };
      },
    }),
  }),
});

export const {
  useGetCostListQuery,
  useGetPersonalCostListQuery,
  useGetParticipantsForPurchaseQuery,
  useGetReceiptForPurchaseQuery,
  useLazyGetParticipantsForPurchaseQuery,
} = costListApi;