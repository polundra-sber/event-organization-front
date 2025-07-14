"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useGetStuffsListQuery,
  useAddStuffToStuffsListMutation,
  useDeleteStuffFromStuffsListMutation,
  useTakeStuffFromStuffsListMutation,
} from "@/lib/api/stuffs-api";
import { Button } from "@/components/ui/button";
import { StuffCard } from "./StuffCard";
import { useGetUserMetadataQuery } from "@/lib/api/events-api";
import { EventRole, EventStatus } from "@/lib/api/types/event-types";
import { ItemModalForm } from "@/components/common/ItemModalForm";
import { toast } from "sonner";
import { StuffListItemCreator } from "@/lib/api/types/stuffs-types";
import { Loader } from "@/components/common/Loader";

interface EventStuffsPageContentProps {
  event_id: number;
}

export const EventStuffsPageContent = ({
  event_id,
}: EventStuffsPageContentProps) => {
  const { data: stuffs, isLoading, isError } = useGetStuffsListQuery(event_id);
  const { data: metadata } = useGetUserMetadataQuery(event_id);

  const [takeStuff] = useTakeStuffFromStuffsListMutation();
  const [deleteStuff] = useDeleteStuffFromStuffsListMutation();
  const [addStuff] = useAddStuffToStuffsListMutation();

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

  const handleCreateStuff = async (data: StuffListItemCreator) => {
    if (data.stuff_name.length > 50) {
      toast.error("Название вещи не должно превышать 50 символов");
      return;
    }

    try {
      await addStuff({
        event_id,
        stuffData: {
          stuff_name: data.stuff_name,
          stuff_description: data.stuff_description || null,
          responsible_login: data.responsible_login || null,
        },
      }).unwrap();
      toast.success("Вещь успешно создана");
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error("Ошибка при создании вещи");
    }
  };

  if (isLoading) return <Loader />;
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
        <label className="text-lg font-bold text-my-black">Список вещей</label>
      </div>

      <div className="flex justify-end mb-4">
        {canEditDelete && (
          <Button
            variant="bright_green"
            onClick={() => setIsCreateModalOpen(true)}
            disabled={!isEventActive}
          >
            Добавить вещь
          </Button>
        )}
      </div>

      {stuffs?.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {stuffs?.length === 0
            ? "У вас нет вещей. Добавьте первую!"
            : "Нет вещей, соответствующих вашему запросу"}
        </p>
      ) : (
        <div className="space-y-4">
          {stuffs?.map((stuff) => (
            <StuffCard
              key={stuff.stuff_id}
              stuff={stuff}
              isOpen={openedDescriptionId === stuff.stuff_id}
              userRole={userRole}
              eventStatus={eventStatus}
              onToggleDescription={toggleDescription}
              onTakeStuff={
                isEventActive
                  ? async ({ event_id, stuff_id }) =>
                      await takeStuff({ event_id, stuff_id }).unwrap()
                  : undefined
              }
              onDeleteStuff={
                isEventActive
                  ? async ({ event_id, stuff_id }) =>
                      await deleteStuff({ event_id, stuff_id }).unwrap()
                  : undefined
              }
              event_id={event_id}
            />
          ))}
        </div>
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <ItemModalForm
              onSubmit={(data) =>
                handleCreateStuff({
                  stuff_name: data.name,
                  stuff_description: data.description,
                  responsible_login: data.responsible_login,
                })
              }
              onCancel={() => setIsCreateModalOpen(false)}
              isLoading={false}
              submitButtonText="Добавить"
              eventId={event_id}
              showDateTimeFields={false}
              formTitle="Добавить новую вещь"
              nameLabel="Название вещи"
              descriptionLabel="Описание вещи"
              maxNameLength={50}
            />
          </div>
        </div>
      )}
    </div>
  );
};
