"use client";

import { useState } from "react";
import {
  useGetMyPurchasesListQuery,
  useEditPurchaseCostMutation,
  useDenyPurchaseMutation,
  useAddReceiptMutation,
} from "@/lib/api/my-purchases-api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ChevronDown, ChevronUp, Plus, UploadIcon } from "lucide-react";
import { FilterModal } from "@/components/common/FilterModal";
import { FilterButton } from "@/components/common/FilterButton";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { ButtonToMain } from "../common/ButtonToMain";
import ReceiptViewer from "@/components/common/ReceiptViewer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // Импорт компонента модалки

export const MyPurchasesPageContent = () => {
  const { data, isLoading, isError } = useGetMyPurchasesListQuery();
  const [editCost] = useEditPurchaseCostMutation();
  const [denyPurchase] = useDenyPurchaseMutation();
  const [addReceipt] = useAddReceiptMutation();

  const [openedDescriptionId, setOpenedDescriptionId] = useState<number | null>(
    null
  );
  const [openedCostId, setOpenedCostId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, boolean>>({});
  const [costs, setCosts] = useState<Record<number, string>>({});
  const [selectedPurchases, setSelectedPurchases] = useState<number[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [openedReceiptsPurchaseId, setOpenedReceiptsPurchaseId] = useState<
    number | null
  >(null);

  const [selectedPurchase, setSelectedPurchase] = useState<{
    purchase_id: number;
    event_id: number;
    purchase_name: string;
  } | null>(null);

  const toggleDescription = (id: number) => {
    setOpenedDescriptionId((prev) => (prev === id ? null : id));
  };

  const toggleCost = (id: number) => {
    setOpenedCostId((prev) => (prev === id ? null : id));
  };

  const toggleSelect = (purchase_id: number) => {
    setSelectedPurchases((prev) =>
      prev.includes(purchase_id)
        ? prev.filter((id) => id !== purchase_id)
        : [...prev, purchase_id]
    );
  };

  const openConfirmDialog = (purchase: {
    purchase_id: number;
    event_id: number;
    purchase_name: string;
  }) => {
    setSelectedPurchase(purchase);
    setConfirmDialogOpen(true);
  };

  const handleEditCost = async (
    event_id: number,
    purchase_id: number,
    newCostStr: string
  ) => {
    const newCost = newCostStr === "" ? 0 : Number(newCostStr);
    if (isNaN(newCost) || newCost < 0) {
      toast.error("Введите корректную стоимость");
      return;
    }
    try {
      await editCost({
        event_id,
        purchase_id,
        data: { cost: newCost }, // Правильная структура данных
      }).unwrap();
      toast.success("Стоимость обновлена");
      setOpenedCostId(null);
      setCosts((prev) => ({ ...prev, [purchase_id]: newCostStr }));
    } catch {
      toast.error("Не удалось изменить стоимость");
    }
  };

  const handleConfirmDeny = async () => {
    if (selectedPurchase) {
      try {
        await denyPurchase({
          event_id: selectedPurchase.event_id,
          purchase_id: selectedPurchase.purchase_id,
        }).unwrap();
        toast.success("Вы отказались от покупки");
      } catch {
        toast.error("Ошибка при отказе");
      } finally {
        setConfirmDialogOpen(false);
        setSelectedPurchase(null);
      }
    }
  };

  const handleUploadReceipt = async (files: FileList) => {
    try {
      // Проверка каждого файла перед загрузкой
      const filesArray = Array.from(files);

      for (const file of filesArray) {
        // Проверка формата файла
        if (!file.type.match("image/jpeg") && !file.type.match("image/jpg")) {
          toast.error(`Файл ${file.name} не является JPG изображением`);
          return;
        }

        // Проверка размера файла (20 МБ = 20 * 1024 * 1024 байт)
        if (file.size > 20 * 1024 * 1024) {
          toast.error(`Файл ${file.name} превышает максимальный размер 20 МБ`);
          return;
        }

        // Не меньше 1 КБ
        if (file.size < 1024) {
          toast.error(`Файл ${file.name} слишком мал`);
          return;
        }
      }

      // Не больше 5 файлов
      if (filesArray.length > 5) {
        toast.error("Можно загрузить не более 5 файлов за раз");
        return;
      }

      // Если все проверки пройдены, загружаем файлы
      for (const purchase_id of selectedPurchases) {
        const event_id =
          data?.purchases.find((p) => p.purchase_id === purchase_id)
            ?.event_id || 0;
        await addReceipt({
          event_id,
          purchase_id,
          files: filesArray,
        }).unwrap();
      }

      toast.success("Чеки прикреплены");
      setSelectedPurchases([]);
      setShowUpload(false);
    } catch {
      toast.error("Ошибка при загрузке");
    }
  };

  if (isLoading) return <p>Загрузка...</p>;
  if (isError) return <p>Ошибка загрузки</p>;

  const purchases = data?.purchases || [];
  const userLogin = data?.userLogin;

  const filteredPurchases = purchases.filter((purchase) => {
    const responsibleFiltersActive = Object.keys(filters).some(
      (key) => key.startsWith("responsible_") && filters[key]
    );

    const responsibleMatch =
      !responsibleFiltersActive ||
      Object.keys(filters).some(
        (key) =>
          key.startsWith("responsible_") &&
          filters[key] &&
          key === `responsible_${purchase.responsible_login}`
      );

    const eventFiltersActive = Object.keys(filters).some(
      (key) => key.startsWith("event_") && filters[key]
    );

    const eventMatch =
      !eventFiltersActive ||
      Object.keys(filters).some(
        (key) =>
          key.startsWith("event_") &&
          filters[key] &&
          key === `event_${purchase.event_id}`
      );

    return responsibleMatch && eventMatch;
  });

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <ButtonToMain className="mb-10" />

      <div className="flex items-center justify-center bg-my-yellow-green px-6 py-3 rounded-xl mb-4">
        <h1 className="text-lg font-bold text-my-black">Мои покупки</h1>
      </div>

      <div className="flex justify-between items-center mb-4">
        <FilterButton onClick={() => setIsFilterOpen(true)} />

        {selectedPurchases.length > 0 && (
          <Button variant="bright_green" onClick={() => setShowUpload(true)}>
            Прикрепить чек
          </Button>
        )}
      </div>

      {filteredPurchases.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Нет покупок</p>
      ) : (
        <div className="space-y-4">
          {filteredPurchases.map((purchase) => {
            const isOpen = openedDescriptionId === purchase.purchase_id;
            const isCostOpen = openedCostId === purchase.purchase_id;
            const isSelected = selectedPurchases.includes(purchase.purchase_id);
            const currentCostStr =
              costs[purchase.purchase_id] ?? purchase.cost.toString();
            const currentCost =
              currentCostStr === "" ? undefined : Number(currentCostStr);

            return (
              <div
                key={purchase.purchase_id}
                className="flex items-start gap-3 relative"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelect(purchase.purchase_id)}
                  className="mt-4"
                />

                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>{purchase.event_name}</CardTitle>
                    <CardDescription className="text-black">
                      {purchase.purchase_name}
                    </CardDescription>
                    <CardDescription className="text-black">
                      Ответственный: {purchase.responsible_name}{" "}
                      {purchase.responsible_surname}
                    </CardDescription>
                    {purchase.has_receipt && (
                      <button
                        onClick={() =>
                          setOpenedReceiptsPurchaseId(purchase.purchase_id)
                        }
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Посмотреть чек
                      </button>
                    )}
                    {currentCost > 0 && (
                      <p className="text-sm text-gray-800 mt-2">
                        Стоимость: {currentCost} ₽
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="flex flex-col gap-4 relative">
                    {purchase.purchase_description && (
                      <div className="relative">
                        <button
                          onClick={() =>
                            toggleDescription(purchase.purchase_id)
                          }
                          className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900"
                        >
                          {isOpen ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                          Описание
                        </button>

                        {isOpen && (
                          <div className="absolute left-0 top-full mt-1 w-64 bg-white p-4 border border-gray-200 rounded-md shadow-lg z-10">
                            <p className="text-sm text-gray-600">
                              {purchase.purchase_description}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="relative">
                      <button
                        onClick={() => toggleCost(purchase.purchase_id)}
                        className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900"
                      >
                        <Plus size={16} />
                        {isCostOpen ? "Скрыть стоимость" : "Добавить стоимость"}
                      </button>

                      {isCostOpen && (
                        <div className="absolute left-0 top-full mt-1 flex items-center gap-2 w-max bg-white p-2 border border-gray-200 rounded-md shadow z-10">
                          <input
                            type="number"
                            value={currentCostStr}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "" || /^\d*$/.test(val)) {
                                setCosts((prev) => ({
                                  ...prev,
                                  [purchase.purchase_id]: val,
                                }));
                              }
                            }}
                            className="border px-2 py-1 w-24"
                            autoFocus
                          />

                          <Button
                            size="sm"
                            onClick={() =>
                              handleEditCost(
                                purchase.event_id,
                                purchase.purchase_id,
                                costs[purchase.purchase_id] ??
                                  purchase.cost.toString()
                              )
                            }
                          >
                            Сохранить
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end">
                      {purchase.responsible_login === userLogin &&
                        (currentCost === 0 || currentCost === undefined) && (
                          <Button
                            variant="dark_green"
                            size="sm"
                            onClick={() =>
                              openConfirmDialog({
                                purchase_id: purchase.purchase_id,
                                event_id: purchase.event_id,
                                purchase_name: purchase.purchase_name,
                              })
                            }
                          >
                            Отказаться
                          </Button>
                        )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* Модальное окно загрузки чеков */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="sm:max-w-[425px] max-w-[90vw] rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Загрузить чек
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-8 px-4 rounded-lg bg-gray-50">
            <UploadIcon className="w-10 h-10 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 text-center mb-4">
              Прикрепите фото чека в формате JPG
              <br />
              (не более 20MB на файл)
            </p>

            <label className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors">
              Выбрать файлы
              <input
                type="file"
                multiple
                accept="image/jpeg, image/jpg"
                onChange={(e) =>
                  e.target.files && handleUploadReceipt(e.target.files)
                }
                className="hidden"
              />
            </label>
          </div>

          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              onClick={() => setShowUpload(false)}
              className="border-gray-300 text-gray-700"
            >
              Отмена
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        isOpen={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title="Отказаться от покупки?"
        description={selectedPurchase?.purchase_name}
        onConfirm={handleConfirmDeny}
        onCancel={() => setConfirmDialogOpen(false)}
        confirmLabel="Да"
        cancelLabel="Нет"
      />

      {openedReceiptsPurchaseId !== null && (
        <ReceiptViewer
          purchaseId={openedReceiptsPurchaseId}
          eventId={
            purchases.find((p) => p.purchase_id === openedReceiptsPurchaseId)
              ?.event_id || 0
          }
          onClose={() => setOpenedReceiptsPurchaseId(null)}
        />
      )}

      <FilterModal
        mode="multi"
        isOpen={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        initialFilters={filters}
        onApply={setFilters}
        categories={[
          {
            id: "responsible",
            label: "Ответственный",
            withSearch: true,
            options: Array.from(
              new Map(
                purchases.map((p) => [
                  `responsible_${p.responsible_login}`,
                  {
                    id: `responsible_${p.responsible_login}`,
                    label: `${p.responsible_name} ${p.responsible_surname}`,
                  },
                ])
              ).values()
            ),
          },
          {
            id: "event",
            label: "Мероприятие",
            withSearch: true,
            options: Array.from(
              new Map(
                purchases.map((p) => [
                  `event_${p.event_id}`,
                  { id: `event_${p.event_id}`, label: p.event_name },
                ])
              ).values()
            ),
          },
        ]}
      />
    </div>
  );
};
