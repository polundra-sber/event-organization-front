import {
  PurchaseListItem,
  PurchaseListItemResponsible,
  PurchaseListItemEditor,
} from "@/lib/api/types/purchases-types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { EventRole, EventStatus } from "@/lib/api/types/event-types";
import { useState } from "react";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { toast } from "sonner";
import { ItemModalForm } from "@/components/common/ItemModalForm";
import { useEditPurchaseInPurchasesListMutation } from "@/lib/api/purchases-api";

interface PurchaseCardProps {
  purchase: PurchaseListItem;
  isOpen: boolean;
  event_id: number;
  userRole: EventRole;
  eventStatus: EventStatus;
  onToggleDescription: (id: number) => void;
  onTakePurchase: (params: {
    event_id: number;
    purchase_id: number;
  }) => Promise<PurchaseListItemResponsible>;
  onDeletePurchase: (params: {
    event_id: number;
    purchase_id: number;
  }) => Promise<void>;
}

export const PurchaseCard = ({
  purchase,
  isOpen,
  event_id,
  userRole,
  eventStatus,
  onToggleDescription,
  onTakePurchase,
  onDeletePurchase,
}: PurchaseCardProps) => {
  const [editPurchase] = useEditPurchaseInPurchasesListMutation();
  const isEventActive = eventStatus === "активно";
  const canEditDelete =
    (userRole === "создатель" || userRole === "организатор") && isEventActive;
  const isPurchaseAvailable = !purchase.responsible_login;

  // Состояния для диалогов и загрузки
  const [isTakeDialogOpen, setIsTakeDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isTaking, setIsTaking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleTakePurchase = async () => {
    setIsTaking(true);
    try {
      const result = await onTakePurchase({
        event_id,
        purchase_id: purchase.purchase_id,
      });
      toast.success(`Покупка "${purchase.purchase_name}" успешно взята`);
      return result;
    } catch (error) {
      toast.error("Не удалось взять покупку");
      throw error;
    } finally {
      setIsTaking(false);
      setIsTakeDialogOpen(false);
    }
  };

  const handleDeletePurchase = async () => {
    setIsDeleting(true);
    try {
      await onDeletePurchase({
        event_id,
        purchase_id: purchase.purchase_id,
      });
      toast.success(`Покупка "${purchase.purchase_name}" удалена`);
    } catch (error) {
      toast.error("Не удалось удалить покупку");
      throw error;
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEditPurchase = async (data: PurchaseListItemEditor) => {
    try {
      await editPurchase({
        event_id,
        purchase_id: purchase.purchase_id,
        purchaseData: {
          ...data,
          responsible_login: data.responsible_login || null,
        },
      }).unwrap();
      toast.success("Покупка успешно обновлена");
      setIsEditing(false);
    } catch (error) {
      toast.error("Ошибка при обновлении покупки");
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {purchase.purchase_name}
            </CardTitle>
            {canEditDelete && isEventActive && (
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="text-sm mt-1">
            Ответственный:{" "}
            {purchase.responsible_login
              ? `${purchase.responsible_name || ""} ${
                  purchase.responsible_surname || ""
                }`.trim()
              : "Не назначен"}
          </p>
        </CardHeader>

        <CardContent className="flex justify-between items-center relative flex-wrap gap-4">
          <div className="relative">
            {purchase.purchase_description && (
              <button
                onClick={() => onToggleDescription(purchase.purchase_id)}
                className="flex items-center text-sm text-gray-700 hover:text-gray-900"
              >
                <span className="w-5 h-5 border border-gray-400 rounded-full flex items-center justify-center mr-2">
                  {isOpen ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </span>
                Описание
              </button>
            )}

            {isOpen && (
              <div className="absolute left-0 mt-1 w-64 bg-white p-4 border border-gray-200 rounded-md shadow-lg z-10">
                <p className="text-sm text-gray-600">
                  {purchase.purchase_description || "Описание не добавлено"}
                </p>
              </div>
            )}
          </div>

          {/* Показываем кнопки только для активных мероприятий */}
          {isEventActive && (
            <div className="flex gap-2 ml-auto">
              {canEditDelete && (
                <>
                  <Button
                    variant="yellow_green"
                    size="sm"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={isDeleting}
                  >
                    Удалить
                  </Button>

                  <ConfirmationDialog
                    isOpen={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    title="Удалить покупку?"
                    description={`Вы уверены, что хотите удалить покупку "${purchase.purchase_name}"?`}
                    onConfirm={handleDeletePurchase}
                    confirmLabel={isDeleting ? "Удаление..." : "Удалить"}
                    cancelLabel="Отмена"
                  />
                </>
              )}

              {isPurchaseAvailable && (
                <>
                  <Button
                    variant="dark_green"
                    size="sm"
                    onClick={() => setIsTakeDialogOpen(true)}
                    disabled={isTaking}
                  >
                    Взять покупку
                  </Button>

                  <ConfirmationDialog
                    isOpen={isTakeDialogOpen}
                    onOpenChange={setIsTakeDialogOpen}
                    title="Взять покупку?"
                    description={`Вы уверены, что хотите взять покупку "${purchase.purchase_name}"?`}
                    onConfirm={handleTakePurchase}
                    confirmLabel={isTaking ? "Принятие..." : "Взять"}
                    cancelLabel="Отмена"
                  />
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Модалка редактирования покупки */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
            <ItemModalForm
              defaultValues={{
                name: purchase.purchase_name,
                description: purchase.purchase_description || null,
                responsible_login: purchase.responsible_login || null,
              }}
              onSubmit={(data) =>
                handleEditPurchase({
                  purchase_name: data.name,
                  purchase_description: data.description,
                  responsible_login: data.responsible_login,
                })
              }
              onCancel={() => setIsEditing(false)}
              isLoading={false}
              submitButtonText="Сохранить"
              eventId={event_id}
              showDateTimeFields={false}
              formTitle="Редактировать покупку"
              nameLabel="Название покупки"
              descriptionLabel="Описание покупки"
            />
          </div>
        </div>
      )}
    </>
  );
};
