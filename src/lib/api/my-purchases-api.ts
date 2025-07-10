import { api } from "./api";
import {
  MyPurchasesListResponse,
  ReceiptList,
  EditPurchaseCostRequest,
} from "@/lib/api/types/my-purchases-types";

export const myPurchasesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyPurchasesList: builder.query<MyPurchasesListResponse, void>({
      query: () => "/events/my-purchases-list",
      providesTags: ["MyPurchases"],
    }),

    editPurchaseCost: builder.mutation<
      void,
      {
        event_id: number;
        purchase_id: number;
        data: EditPurchaseCostRequest;
      }
    >({
      query: ({ event_id, purchase_id, data }) => ({
        url: `/events/${event_id}/my-purchases-list/${purchase_id}/edit-purchase-cost`,
        method: "PATCH",
        body: data, // Отправляем только data (который содержит cost)
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["MyPurchases"],
    }),

    denyPurchase: builder.mutation<
      void,
      { event_id: number; purchase_id: number }
    >({
      query: ({ event_id, purchase_id }) => ({
        url: `/events/${event_id}/my-purchases-list/${purchase_id}/deny-purchase`,
        method: "DELETE",
      }),
      invalidatesTags: ["MyPurchases"],
    }),

    addReceipt: builder.mutation<
      void,
      { event_id: number; purchase_id: number; files: File[] }
    >({
      query: ({ event_id, purchase_id, files }) => {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        return {
          url: `/events/${event_id}/my-purchases-list/${purchase_id}/add-receipt`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["MyPurchases"],
    }),

    getReceipts: builder.query<
      ReceiptList,
      { event_id: number; purchase_id: number }
    >({
      query: ({ event_id, purchase_id }) => ({
        url: `/events/${event_id}/purchases-list/${purchase_id}/get-receipt`,
        responseHandler: (response) => response.formData(), // получить formData
      }),
      transformResponse: async (formData: FormData) => {
        try {
          const files = formData.getAll("file") as File[];
          console.log("Received files:", files);
          return { files };
        } catch (error) {
          console.error("Error processing form data:", error);
          return { files: [] };
        }
      },
    }),
  }),
});

export const {
  useGetMyPurchasesListQuery,
  useEditPurchaseCostMutation,
  useDenyPurchaseMutation,
  useAddReceiptMutation,
  useGetReceiptsQuery,
} = myPurchasesApi;
