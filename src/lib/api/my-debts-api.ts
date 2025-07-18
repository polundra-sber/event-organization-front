import { api } from "./api";
import { MyDebtListItem } from "@/lib/api/types/my-debts-types";

export const myDebtsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyDebtsList: builder.query<MyDebtListItem[], void>({
      query: () => `/my-debts-list`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ debt_id }) => ({
                type: "MyDebt" as const,
                id: debt_id,
              })),
              { type: "MyDebt", id: "LIST" },
            ]
          : [{ type: "MyDebt", id: "LIST" }],
    }),

    markDebtPaidInMyDebtsList: builder.mutation<void, { debt_id: number }>({
      query: ({ debt_id }) => ({
        url: `/my-debts-list/${debt_id}/mark-debt-paid`,
        method: "PATCH",
      }),
      invalidatesTags: (_, __, { debt_id }) => [
        { type: "MyDebt", id: debt_id },
        { type: "MyDebt", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetMyDebtsListQuery,
  useMarkDebtPaidInMyDebtsListMutation,
} = myDebtsApi;
