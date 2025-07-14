"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useGetPurchasesListQuery,
  useTakePurchaseFromPurchasesListMutation,
  useDeletePurchaseFromPurchasesListMutation,
  useAddPurchaseToPurchasesListMutation,
} from "@/lib/api/purchases-api";
import { Button } from "@/components/ui/button";
import { PurchaseCard } from "./PurchaseCard";
import { useGetUserMetadataQuery } from "@/lib/api/events-api";
import { EventRole, EventStatus } from "@/lib/api/types/event-types";
import { ItemModalForm } from "@/components/common/ItemModalForm";
import { toast } from "sonner";
import { PurchaseListItemCreator } from "@/lib/api/types/purchases-types";

interface EventPurchasesPageContentProps {
  event_id: number;
}

export const EventPurchasesPageContent = ({
  event_id,
}: EventPurchasesPageContentProps) => {
  const {
    data: purchases,
    isLoading,
    isError,
  } = useGetPurchasesListQuery(event_id);
  const { data: metadata } = useGetUserMetadataQuery(event_id);
  const [takePurchase] = useTakePurchaseFromPurchasesListMutation();
  const [deletePurchase] = useDeletePurchaseFromPurchasesListMutation();
  const [addPurchase] = useAddPurchaseToPurchasesListMutation();

  const [openedDescriptionId, setOpenedDescriptionId] = useState<number | null>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const userRole: EventRole = (metadata?.role_name as EventRole) || "участник";
  const eventStatus: EventStatus =
    (metadata?.event_status_name as EventStatus) || "активно";
  const isEventActive = eventStatus === "активно";
  const canEditDelete =
    (userRole === "создатель" || userRole === "организатор") && isEventActive;

  const toggleDescription = (id: number) => {
    setOpenedDescriptionId((prev) => (prev === id ? null : id));
  };

  const handleCreatePurchase = async (data: PurchaseListItemCreator) => {
    try {
      await addPurchase({
        event_id,
        purchaseData: {
          purchase_name: data.purchase_name,
          purchase_description: data.purchase_description || null,
          responsible_login: data.responsible_login || null,
        },
      }).unwrap();
      toast.success("Покупка успешно добавлена");
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error("Ошибка при добавлении покупки");
    }
  };

  if (isLoading) return <p className="text-center p-4">Загрузка...</p>;
  if (isError)
    return <p className="text-red-500 text-center p-4">Ошибка загрузки</p>;

  return (
    <div className="p-4 min-h-screen bg-gray-50 max-w-full overflow-x-hidden">
      <div className="mb-5">
        <Button variant="dark_green" size="sm" asChild>
          <Link href={`/events/${event_id}`}>← Назад</Link>
        </Button>
      </div>

      <div className="flex items-center justify-center bg-my-yellow-green px-6 py-3 rounded-xl mb-4">
        <label className="text-lg font-bold text-my-black">
          Список покупок
        </label>
      </div>

      <div className="flex justify-between items-center mb-4">
        {userRole === "создатель" && (
          <Button variant="bright_green" asChild>
            <Link href={`/events/${event_id}/cost-allocation-list`}>
              Расходы
            </Link>
          </Button>
        )}
        {canEditDelete && (
          <Button
            variant="bright_green"
            onClick={() => setIsCreateModalOpen(true)}
            disabled={!isEventActive}
          >
            Добавить позицию
          </Button>
        )}
      </div>

      {purchases?.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Нет покупок</p>
      ) : (
        <div className="space-y-4">
          {purchases?.map((purchase) => (
            <PurchaseCard
              key={purchase.purchase_id}
              purchase={purchase}
              isOpen={openedDescriptionId === purchase.purchase_id}
              userRole={userRole}
              eventStatus={eventStatus}
              onToggleDescription={toggleDescription}
              onTakePurchase={
                isEventActive
                  ? async ({ event_id, purchase_id }) => {
                      const result = await takePurchase({
                        event_id,
                        purchase_id,
                      }).unwrap();
                      return result;
                    }
                  : undefined
              }
              onDeletePurchase={
                isEventActive
                  ? async ({ event_id, purchase_id }) => {
                      await deletePurchase({ event_id, purchase_id }).unwrap();
                    }
                  : undefined
              }
              event_id={event_id}
            />
          ))}
        </div>
      )}

      {/* Модалка добавления покупки */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <ItemModalForm
              onSubmit={(data) =>
                handleCreatePurchase({
                  purchase_name: data.name,
                  purchase_description: data.description,
                  responsible_login: data.responsible_login,
                })
              }
              onCancel={() => setIsCreateModalOpen(false)}
              isLoading={false}
              submitButtonText="Добавить"
              eventId={event_id}
              showDateTimeFields={false}
              formTitle="Добавить покупку"
              nameLabel="Название покупки"
              descriptionLabel="Описание покупки"
            />
          </div>
        </div>
      )}
    </div>
  );
};
