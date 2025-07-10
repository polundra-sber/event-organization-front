import { api } from "./api";
import { MyIncomeListItem, DebtNotExistResponse } from "@/lib/api/types/my-incomes-types";

export const myIncomesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMyIncomesList: build.query<MyIncomeListItem[], void>({
      query: () => "/my-incomes-list",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ debt_id }) => ({
                type: "MyIncome" as const,
                id: debt_id,
              })),
              { type: "MyIncome", id: "LIST" },
            ]
          : [{ type: "MyIncome", id: "LIST" }],
    }),
    markIncomeReceivedInMyIncomesList: build.mutation<
      void,
      { debt_id: number }
    >({
      query: ({ debt_id }) => ({
        url: `/my-incomes-list/${debt_id}/mark-income-received`,
        method: "PATCH",
      }),
      invalidatesTags: (_, __, { debt_id }) => [
        { type: "MyIncome", id: debt_id },
        { type: "MyIncome", id: "LIST" },
      ],
    }),
  }),
});


export const {
  useGetMyIncomesListQuery,
  useMarkIncomeReceivedInMyIncomesListMutation,
} = myIncomesApi;
