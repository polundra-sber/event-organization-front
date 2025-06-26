"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useGetProfileQuery, useUpdateProfileMutation, api } from "@/lib/api/api";
import { useDispatch } from "react-redux";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


// Функция для получения начальных букв
function getInitials(firstName: string, lastName: string) {
  const firstInitial = firstName?.charAt(0).toUpperCase() || "?";
  const lastInitial = lastName?.charAt(0).toUpperCase() || "?";
  return `${firstInitial}.${lastInitial}`;
}

export const ProfilePageContent = () => {
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  const { data: profile, isLoading, isError } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    firstName: "",
    lastName: "",
    login: "",
    password: "",
    email: "",
    requisites: "",
  });

  // 🔁 Обновляем editedProfile, когда profile загрузился
  useEffect(() => {
    if (profile) {
      setEditedProfile(profile);
    }
  }, [profile]);

  const dispatch = useDispatch();
  const toggleEdit = async () => {
    if (isEditing) {
      try {
        const { login, ...dataToUpdate } = editedProfile;
        const result = await updateProfile(dataToUpdate).unwrap();

        // ОБНОВЛЯЕМ кэш через dispatch
        dispatch(
          api.util.updateQueryData("getProfile", undefined, (draft) => {
            Object.assign(draft, result);
          })
        );

        setEditedProfile(result);
        setIsEditing(false);
      } catch (error) {
        console.error("Ошибка сохранения:", error);
      }
    } else {
      setIsEditing(true);
    }
  };


  
  if (isLoading) return <p>Загрузка профиля...</p>;
  if (isError) return <p>Ошибка загрузки профиля</p>;

  return (
    <div className="p-4 min-h-screen bg-gray-50">
    <div className="flex justify-start mb-6">
      {isEditing ? (
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
                У вас есть несохранённые изменения. Если вы уйдёте, они будут потеряны.
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
      ) : (
        <Button variant="pink" size="sm" asChild>
          <Link href="/events">← На главную</Link>
        </Button>
      )}
    </div>


      {/* Блок профиля */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
        {/* Имя + Аватар */}
        <div className="flex items-center gap-4 bg-pink-100 p-1 rounded-xl">
          <Avatar className="w-16 h-16">
            <AvatarFallback>
              {getInitials(editedProfile.firstName, editedProfile.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full bg-pink-100">
            {isEditing ? (
              <>
                <Input
                  value={editedProfile.firstName || ""}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      firstName: e.target.value,
                    })
                  }
                  placeholder="Имя"
                  className="w-full sm:w-auto"
                />
                <Input
                  value={editedProfile.lastName || ""}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      lastName: e.target.value,
                    })
                  }
                  placeholder="Фамилия"
                  className="w-full sm:w-auto"
                />
              </>
            ) : (
              <h2 className="text-xl font-semibold">
                {profile.firstName} {profile.lastName}
              </h2>
            )}
          </div>
        </div>

        {/* Логин */}
        <div className="bg-pink-100 p-2 rounded-xl space-y-1">
          <p className="text-gray-900">{profile.login}</p>
        </div>


        {/* Email */}
        <div className="bg-pink-100 p-2 rounded-xl space-y-1">
          <label className="text-sm text-gray-500">Email</label>
          {isEditing ? (
            <Input
              value={editedProfile.email || ""}
              onChange={(e) =>
                setEditedProfile({
                  ...editedProfile,
                  email: e.target.value,
                })
              }
              placeholder="example@example.com"
            />
          ) : (
            <p className="text-gray-900">{profile.email}</p>
          )}
        </div>

        {/* Реквизиты */}
        <div className="bg-pink-100 p-2 rounded-xl space-y-1">
          <label className="text-sm text-gray-500">Реквизиты</label>
          {isEditing ? (
            <Input
              value={editedProfile.requisites || ""}
              onChange={(e) =>
                setEditedProfile({
                  ...editedProfile,
                  requisites: e.target.value,
                })
              }
              placeholder="Реквизиты"
            />
          ) : (
            <p className="text-gray-900">{profile.requisites}</p>
          )}
        </div>

        {/* Кнопка редактировать / сохранить */}
        <div className="mt-4">
          <Button onClick={toggleEdit} variant="dark_pink" className="w-full">
            {isEditing ? "Сохранить" : "Редактировать"}
          </Button>
        </div>
      </div>
    </div>
  );
};