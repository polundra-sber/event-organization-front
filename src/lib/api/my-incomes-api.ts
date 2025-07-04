import { api } from "./api";
import { MyIncomeListItem, EventNotExistResponse } from "@/lib/api/types/my-incomes-types";

export const myIncomesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMyIncomesList: build.query<MyIncomeListItem[], void>({
      query: () => "/events/my-incomes-list",
      providesTags: ["MyIncomes"],
    }),
    markIncomeReceivedInMyIncomesList: build.mutation<
      void | EventNotExistResponse,
      { event_id: number; debt_id: number }
    >({
      query: ({ event_id, debt_id }) => ({
        url: `/events/${event_id}/my-incomes-list/${debt_id}/mark-income-received`,
        method: "PATCH",
      }),
      invalidatesTags: ["MyIncomes"],
    }),
  }),
});

export const {
  useGetMyIncomesListQuery,
  useMarkIncomeReceivedInMyIncomesListMutation,
} = myIncomesApi;
