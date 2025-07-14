import { User } from "@/lib/api/types/participants-types";
import {
  StarIcon,
  StarFilledIcon,
  CrossIcon,
  CheckIcon,
} from "@/components/ui/icons";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { useState } from "react";
import { toast } from "sonner";

interface ParticipantCardProps {
  participant: User;
  canManage: boolean;
  isCreator: boolean;
  onDelete: (login: string) => Promise<void>;
  onToggleOrganizer: (login: string) => Promise<void>;
  onApprove: (login: string) => Promise<void>;
  event_id: number;
}

export const ParticipantCard = ({
  participant,
  canManage,
  isCreator,
  onDelete,
  onToggleOrganizer,
  onApprove,
  event_id,
}: ParticipantCardProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const isParticipantCreator = participant.role_name === "создатель";
  const isParticipantOrganizer = participant.role_name === "организатор";
  const isNotAllowed = participant.role_name === "не допущен";

  const handleAction = async (action: () => Promise<void>) => {
    try {
      setIsUpdating(true);
      await action();
    } catch (error) {
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Левая колонка — имя и email, в столбик */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <p className="font-medium text-my-black break-words">
          {participant.surname} {participant.name}
        </p>
        <p className="text-sm text-gray-600 break-words">{participant.email}</p>
      </div>

      {/* Правая колонка — роли/звезды/кнопки */}
      <div className="flex items-center gap-3 ml-4 shrink-0">
        {isParticipantCreator ? (
          <span className="text-sm text-gray-500 px-2 py-1 bg-gray-100 rounded">
            Создатель
          </span>
        ) : isNotAllowed ? (
          canManage && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAction(() => onApprove(participant.login))}
                disabled={isUpdating}
                className="p-1 text-green-500 hover:bg-green-50 rounded-full"
                aria-label="Допустить участника"
              >
                <CheckIcon className="h-5 w-5" />
              </button>

              <button
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isUpdating}
                className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                aria-label="Отклонить участника"
              >
                <CrossIcon className="h-5 w-5" />
              </button>

              <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Отклонить участника?"
                description={`Вы уверены, что хотите отклонить ${participant.name} ${participant.surname}?`}
                onConfirm={() =>
                  handleAction(() => onDelete(participant.login))
                }
                confirmLabel="Отклонить"
                cancelLabel="Отмена"
              />
            </div>
          )
        ) : (
          <>
            {!canManage && isParticipantOrganizer && (
              <span className="text-sm text-gray-500 px-2 py-1 bg-gray-100 rounded">
                Организатор
              </span>
            )}

            {canManage && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleAction(() => onToggleOrganizer(participant.login))
                  }
                  disabled={isUpdating}
                  className={`p-1 rounded-full ${
                    isParticipantOrganizer
                      ? "text-yellow-500 hover:bg-yellow-50"
                      : "text-gray-400 hover:bg-gray-50"
                  }`}
                  aria-label={
                    isParticipantOrganizer
                      ? "Сделать участником"
                      : "Сделать организатором"
                  }
                >
                  {isParticipantOrganizer ? (
                    <StarFilledIcon className="h-5 w-5" />
                  ) : (
                    <StarIcon className="h-5 w-5" />
                  )}
                </button>

                <button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={isUpdating}
                  className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                  aria-label="Удалить участника"
                >
                  <CrossIcon className="h-5 w-5" />
                </button>

                <ConfirmationDialog
                  isOpen={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                  title="Удалить участника?"
                  description={`Вы уверены, что хотите удалить ${participant.name} ${participant.surname} из мероприятия?`}
                  onConfirm={() =>
                    handleAction(() => onDelete(participant.login))
                  }
                  confirmLabel="Удалить"
                  cancelLabel="Отмена"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
