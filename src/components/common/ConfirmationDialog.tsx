"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react"; // Или любые другие иконки

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

type ConfirmationDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
};

/**
 * Модальное окно подтверждения действий
 *
 * @description
 * Компонент `ConfirmationDialog` отображает модальное окно с вопросом подтверждения.
 * Может использоваться для предупреждений:
 * - При выходе из формы с несохранёнными данными
 * - Для удаления/отмены действия
 * - Для принятия важного решения пользователем
 *
 * @param {Object} props - Свойства диалога
 * @param {boolean} props.isOpen - Открывает или закрывает модальное окно
 * @param {(open: boolean) => void} props.onOpenChange - Callback для изменения состояния открытия
 * @param {string} props.title - Заголовок модального окна
 * @param {string} [props.description] - Опциональное описание под заголовком
 * @param {() => void} props.onConfirm - Функция, которая вызывается при нажатии "Да"
 * @param {() => void} [props.onCancel] - Функция, вызываемая при нажатии "Нет" или закрытии окна
 * @param {string} [props.confirmLabel="Да"] - Текст кнопки подтверждения
 * @param {string} [props.cancelLabel="Нет"] - Текст кнопки отмены
 *
 * @example
 *    <ConfirmationDialog
 *      isOpen={showLeaveDialog}
 *      onOpenChange={setShowLeaveDialog}
 *      title="Вы действительно хотите выйти?"
 *      description="У вас есть несохранённые изменения. Если вы уйдёте — они будут потеряны."
 *      onConfirm={handleConfirmExit}
 *      confirmLabel="Да"
 *      cancelLabel="Нет"
 *     />
 *   const handleCancelEdit = () => {
 *      setIsEditing(false); // Просто выходим без сохранения
 *      setShowLeaveDialog(false);
 *   };
 *
 *   const handleConfirmExit = () => {
 *      setIsEditing(false);
 *      setShowLeaveDialog(false);
 *   };
 */

export const ConfirmationDialog = ({
  isOpen,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = "Да",
  cancelLabel = "Нет",
}: ConfirmationDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        {/* Можно передать любую кнопку через asChild */}
        <button className="hidden">Триггер</button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={onCancel}>
              <X className="mr-1 h-4 w-4" />
              {cancelLabel}
            </Button>
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button variant="default" onClick={onConfirm}>
              <Check className="mr-1 h-4 w-4" />
              {confirmLabel}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
