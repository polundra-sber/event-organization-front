"use client";

import {
  StuffListItem,
  StuffListItemEditor,
  StuffListItemResponsible,
} from "@/lib/api/types/stuffs-types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Pencil, ChevronDown, ChevronUp } from "lucide-react";
import { EventRole, EventStatus } from "@/lib/api/types/event-types";
import { useState } from "react";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { toast } from "sonner";
import { ItemModalForm } from "@/components/common/ItemModalForm";
import { useEditStuffInStuffsListMutation } from "@/lib/api/stuffs-api";

interface StuffCardProps {
  stuff: StuffListItem;
  isOpen: boolean;
  event_id: number;
  userRole: EventRole;
  eventStatus: EventStatus;
  onToggleDescription: (id: number) => void;
  onTakeStuff: (params: {
    event_id: number;
    stuff_id: number;
  }) => Promise<StuffListItemResponsible>;
  onDeleteStuff: (params: {
    event_id: number;
    stuff_id: number;
  }) => Promise<void>;
}

export const StuffCard = ({
  stuff,
  isOpen,
  event_id,
  userRole,
  eventStatus,
  onToggleDescription,
  onTakeStuff,
  onDeleteStuff,
}: StuffCardProps) => {
  const [editStuff] = useEditStuffInStuffsListMutation();
  const isEventActive = eventStatus === "активно";
  const canEditDelete =
    (userRole === "создатель" || userRole === "организатор") && isEventActive;

  const isStuffAvailable = !stuff.responsible_login;

  const [isTakeDialogOpen, setIsTakeDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isTaking, setIsTaking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleTakeStuff = async () => {
    setIsTaking(true);
    try {
      await onTakeStuff({ event_id, stuff_id: stuff.stuff_id });
      toast.success(`Вещь "${stuff.stuff_name}" успешно взята`);
    } catch (error) {
      toast.error("Не удалось взять вещь");
    } finally {
      setIsTaking(false);
      setIsTakeDialogOpen(false);
    }
  };

  const handleDeleteStuff = async () => {
    setIsDeleting(true);
    try {
      await onDeleteStuff({ event_id, stuff_id: stuff.stuff_id });
      toast.success(`Вещь "${stuff.stuff_name}" удалена`);
    } catch (error) {
      toast.error("Не удалось удалить вещь");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEditStuff = async (data: StuffListItemEditor) => {
    if (data.stuff_name.length > 50) {
      toast.error("Название вещи не должно превышать 50 символов");
      return;
    }

    try {
      await editStuff({
        event_id,
        stuff_id: stuff.stuff_id,
        stuffData: {
          ...data,
          responsible_login: data.responsible_login || null,
        },
      }).unwrap();
      toast.success("Вещь успешно обновлена");
      setIsEditing(false);
    } catch (error) {
      toast.error("Ошибка при обновлении вещи");
    }
  };

  return (
    <>
      <Card className="w-full max-w-full min-w-0">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-2 min-w-0">
            <CardTitle className="text-lg font-semibold break-words overflow-hidden text-ellipsis min-w-0">
              {stuff.stuff_name}
            </CardTitle>
            {canEditDelete && (
              <button
                className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                onClick={() => setIsEditing(true)}
                aria-label="Редактировать"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="text-sm mt-1 break-words min-w-0">
            Ответственный:{" "}
            {stuff.responsible_login
              ? `${stuff.responsible_name || ""} ${
                  stuff.responsible_surname || ""
                }`.trim()
              : "Не назначен"}
          </p>
        </CardHeader>

        <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-0">
          <div className="relative w-full min-w-0">
            {stuff.stuff_description && (
              <button
                onClick={() => onToggleDescription(stuff.stuff_id)}
                className="flex items-center text-sm text-gray-700 hover:text-gray-900 w-full min-w-0"
              >
                <span className="w-5 h-5 border border-gray-400 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  {isOpen ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </span>
                <span className="text-left break-words overflow-hidden text-ellipsis min-w-0">
                  Описание
                </span>
              </button>
            )}

            {isOpen && (
              <div className="absolute left-0 mt-1 w-64 bg-white p-4 border border-gray-200 rounded-md shadow-lg z-10">
                <p className="text-sm text-gray-600 break-words whitespace-pre-line">
                  {stuff.stuff_description || "Описание не добавлено"}
                </p>
              </div>
            )}
          </div>

          {isEventActive && (
            <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end min-w-0">
              {canEditDelete && (
                <>
                  <Button
                    variant="yellow_green"
                    size="sm"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={isDeleting}
                    className="min-w-0"
                  >
                    Удалить
                  </Button>

                  <ConfirmationDialog
                    isOpen={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    title="Удалить вещь?"
                    description={`Вы уверены, что хотите удалить "${stuff.stuff_name}"?`}
                    onConfirm={handleDeleteStuff}
                    confirmLabel={isDeleting ? "Удаление..." : "Удалить"}
                    cancelLabel="Отмена"
                  />
                </>
              )}

              {isStuffAvailable && (
                <>
                  <Button
                    variant="dark_green"
                    size="sm"
                    onClick={() => setIsTakeDialogOpen(true)}
                    disabled={isTaking}
                    className="min-w-0"
                  >
                    Взять вещь
                  </Button>

                  <ConfirmationDialog
                    isOpen={isTakeDialogOpen}
                    onOpenChange={setIsTakeDialogOpen}
                    title="Взять вещь?"
                    description={`Вы уверены, что хотите взять "${stuff.stuff_name}"?`}
                    onConfirm={handleTakeStuff}
                    confirmLabel={isTaking ? "Принятие..." : "Взять"}
                    cancelLabel="Отмена"
                  />
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <ItemModalForm
              defaultValues={{
                name: stuff.stuff_name,
                description: stuff.stuff_description || null,
                responsible_login: stuff.responsible_login || null,
              }}
              onSubmit={(data) =>
                handleEditStuff({
                  stuff_name: data.name,
                  stuff_description: data.description,
                  responsible_login: data.responsible_login,
                })
              }
              onCancel={() => setIsEditing(false)}
              isLoading={false}
              submitButtonText="Сохранить"
              eventId={event_id}
              showDateTimeFields={false}
              formTitle="Редактировать вещь"
              nameLabel="Название вещи"
              maxNameLength={50}
            />
          </div>
        </div>
      )}
    </>
  );
};
