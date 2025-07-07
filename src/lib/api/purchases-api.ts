import { api } from "./api";
import {
  PurchaseListItem,
  PurchaseListItemCreator,
  PurchaseListItemEditor,
  PurchaseListItemResponsible,
} from "@/lib/api/types/purchases-types";

export const {
  useGetPurchasesListQuery,
  useAddPurchaseToPurchasesListMutation,
  useEditPurchaseInPurchasesListMutation,
  useDeletePurchaseFromPurchasesListMutation,
  useTakePurchaseFromPurchasesListMutation,
} = api.injectEndpoints({
  endpoints: (builder) => ({
    // Получить список покупок
    getPurchasesList: builder.query<PurchaseListItem[], number>({
      query: (event_id) => ({
        url: `/events/${event_id}/purchases-list`,
        method: "GET",
      }),
      providesTags: (result, error, event_id) => [
        { type: "PurchaseList", id: event_id },
      ],
    }),

    // Добавить новую позицию покупки
    addPurchaseToPurchasesList: builder.mutation<
      PurchaseListItem,
      { event_id: number; purchaseData: PurchaseListItemCreator }
    >({
      query: ({ event_id, purchaseData }) => ({
        url: `/events/${event_id}/purchases-list/add-purchase`,
        method: "POST",
        body: purchaseData,
      }),
      invalidatesTags: (result, error, { event_id }) => [
        { type: "PurchaseList", id: event_id },
      ],
    }),

    // Изменить позицию покупки
    editPurchaseInPurchasesList: builder.mutation<
      PurchaseListItem,
      {
        event_id: number;
        purchase_id: number;
        purchaseData: PurchaseListItemEditor;
      }
    >({
      query: ({ event_id, purchase_id, purchaseData }) => ({
        url: `/events/${event_id}/purchases-list/${purchase_id}/edit-purchase`,
        method: "PATCH",
        body: purchaseData,
      }),
      invalidatesTags: (result, error, { event_id }) => [
        { type: "PurchaseList", id: event_id },
      ],
    }),

    // Удалить позицию покупки
    deletePurchaseFromPurchasesList: builder.mutation<
      void,
      { event_id: number; purchase_id: number }
    >({
      query: ({ event_id, purchase_id }) => ({
        url: `/events/${event_id}/purchases-list/${purchase_id}/delete-purchase`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { event_id }) => [
        { type: "PurchaseList", id: event_id },
      ],
    }),

    // Пользователь берет позицию покупки
    takePurchaseFromPurchasesList: builder.mutation<
      PurchaseListItemResponsible,
      { event_id: number; purchase_id: number }
    >({
      query: ({ event_id, purchase_id }) => ({
        url: `/events/${event_id}/purchases-list/${purchase_id}/take-purchase`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { event_id }) => [
        { type: "PurchaseList", id: event_id },
      ],
    }),
  }),
});
