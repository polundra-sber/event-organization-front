"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type Props = {
  className?: string;
  isEditing?: boolean;
};

/**
 * Кнопка "На главную"
 *
 * Предназначена для перехода на главную страницу.
 * Если передано `isEditing={true}`, показывает диалог с предупреждением.
 *
 * @param props - Свойства кнопки
 * @param props.className - Дополнительные стили
 * @param props.isEditing - Если `true`, активирует предупреждение о несохранённых изменениях
 *
 *  !!!Примеры использования:
 *
 * // 1. Простой переход на главную без подтверждения
 * <ButtonToMain />
 *
 * // 2. Переход на главную с предупреждением, если есть несохранённые изменения
 * <ButtonToMain isEditing={isEditing} />
 * <ButtonToMain isEditing={true} />
 *
 * // 3. С дополнительным позиционированием
 * <ButtonToMain className="mt-8" />
 */
export const ButtonToMain = ({ className, isEditing = false }: Props) => {
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  if (isEditing) {
    return (
      <div className={className ?? "mb-6"}>
        <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
          <AlertDialogTrigger asChild>
            <Button
              variant="pink"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                setShowLeaveDialog(true);
              }}
              asChild
            >
              <Link href="/events">← На главную</Link>
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Вы действительно хотите уйти?</AlertDialogTitle>
              <AlertDialogDescription>
                У вас есть несохранённые изменения. Если вы уйдёте, они будут
                потеряны.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowLeaveDialog(false)}>
                Отмена
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Link href="/events" onClick={() => setShowLeaveDialog(false)}>
                  Всё равно уйти
                </Link>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className={className ?? "mb-6"}>
      <Button variant="pink" size="sm" asChild>
        <Link href="/events">← На главную</Link>
      </Button>
    </div>
  );
};
