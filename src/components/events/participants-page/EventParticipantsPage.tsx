"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  useGetEventParticipantsListQuery,
  useDeleteParticipantMutation,
  useUpdateParticipantRoleMutation,
  useAddParticipantsMutation,
} from "@/lib/api/participants-api";
import { useGetUserMetadataQuery } from "@/lib/api/events-api";
import { EventRole, EventStatus } from "@/lib/api/types/event-types";
import { ParticipantCard } from "./ParticipantCard";
import { toast } from "sonner";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AddParticipantsModal } from "./AddParticipantsModal";
import { Loader } from "@/components/common/Loader";

interface EventParticipantsPageContentProps {
  event_id: number;
}

export const EventParticipantsPageContent = ({
  event_id,
}: EventParticipantsPageContentProps) => {
  const {
    data: participants,
    isLoading,
    isError,
  } = useGetEventParticipantsListQuery(event_id);
  const { data: metadata } = useGetUserMetadataQuery(event_id);
  const [deleteParticipant] = useDeleteParticipantMutation();
  const [updateParticipantRole] = useUpdateParticipantRoleMutation();
  const [addParticipants] = useAddParticipantsMutation();

  // Состояния для сворачивания секцим и модалки добавления
  const [showNotAllowed, setShowNotAllowed] = useState(false);

  const userRole: EventRole = (metadata?.role_name as EventRole) || "участник";
  const eventStatus: EventStatus =
    (metadata?.event_status_name as EventStatus) || "активно";
  const isEventActive = eventStatus === "активно";

  const isCreator = userRole === "создатель";
  const canManage = isCreator && isEventActive;

  // Разделяем участников на категории
  const notAllowed =
    participants?.filter((p) => p.role_name === "не допущен") || [];
  const confirmedParticipants =
    participants?.filter(
      (p) => !["не допущен", "заявка"].includes(p.role_name)
    ) || [];

  const handleDelete = async (login: string) => {
    try {
      await deleteParticipant({ event_id, participant_login: login }).unwrap();
      toast.success("Участник удален");
    } catch (error) {
      toast.error("Ошибка при удалении участника");
      throw error;
    }
  };

  const handleToggleOrganizer = async (login: string) => {
    try {
      const response = await updateParticipantRole({
        event_id,
        participant_login: login,
      }).unwrap();
      toast.success(`Роль изменена на "${response.role}"`);
    } catch (error) {
      toast.error("Ошибка при изменении роли");
      throw error;
    }
  };

  const handleApprove = async (login: string) => {
    try {
      await addParticipants({
        event_id,
        logins: [login],
      }).unwrap();
      toast.success("Участник допущен к мероприятию");
    } catch (error) {
      toast.error("Ошибка при допуске участника");
      throw new Error("Ошибка при допуске участника", { cause: error });
    }
  };

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="flex justify-center p-8">
        <p>Ошибка загрузки</p>
      </div>
    );

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="mb-5">
        <Button variant="dark_green" size="sm" asChild>
          <Link href={`/events/${event_id}`}>← Назад</Link>
        </Button>
      </div>

      {/* Секция не допущенных участников */}
      {notAllowed.length > 0 && (
        <div className="mb-8">
          <div
            className="flex items-center justify-between bg-my-yellow-green px-6 py-3 rounded-xl mb-4 cursor-pointer hover:bg-my-yellow-green/90 transition-colors"
            onClick={() => setShowNotAllowed(!showNotAllowed)}
          >
            <h2 className="text-lg font-semibold text-my-black">Заявки</h2>
            {showNotAllowed ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </div>

          {showNotAllowed && (
            <div className="space-y-3">
              {notAllowed.map((participant) => (
                <ParticipantCard
                  key={participant.login}
                  participant={participant}
                  canManage={canManage}
                  isCreator={isCreator}
                  onDelete={handleDelete}
                  onToggleOrganizer={handleToggleOrganizer}
                  onApprove={handleApprove}
                  event_id={event_id}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Секция участников */}
      <div>
        <div className="flex items-center justify-center bg-my-yellow-green px-6 py-3 rounded-xl mb-4">
          <h2 className="text-lg font-semibold text-my-black">Участники</h2>
        </div>

        <div className="space-y-3">
          {confirmedParticipants.length === 0 ? (
            <p className="text-gray-500">Нет участников</p>
          ) : (
            confirmedParticipants.map((participant) => (
              <ParticipantCard
                key={participant.login}
                participant={participant}
                canManage={canManage}
                isCreator={isCreator}
                onDelete={handleDelete}
                onToggleOrganizer={handleToggleOrganizer}
                onApprove={handleApprove}
                event_id={event_id}
              />
            ))
          )}
        </div>
      </div>

      {canManage && (
        <div className="mt-8 flex justify-center">
          <AddParticipantsModal
            event_id={event_id}
            onAddParticipants={async (logins) => {
              await addParticipants({ event_id, logins });
              toast.success("Участники успешно добавлены");
            }}
            existingParticipants={participants?.map((p) => p.login) || []}
          />
        </div>
      )}
    </div>
  );
};
