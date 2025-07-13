// src/app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  profileApi,
} from "@/lib/api/profile-api";
import { useDispatch } from "react-redux";
import { ButtonToMain } from "@/components/common/ButtonToMain";
import { UserProfile } from "@/lib/api/types/profile-types";
import { getInitials } from "@/components/common/UserAvatar";
import { Loader } from "../common/Loader";

export const ProfilePageContent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);

  const { data: profile, isLoading, isError } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (profile) {
      setEditedProfile(profile);
    }
  }, [profile]);

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError("Email не может быть пустым");
      return false;
    }
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      setEmailError("Введите корректный email адрес");
      return false;
    }
    setEmailError(null);
    return true;
  };

  const validateNames = () => {
    if (!editedProfile?.name.trim() || !editedProfile?.surname.trim()) {
      setNameError("Имя и фамилия не могут быть пустыми");
      return false;
    }
    setNameError(null);
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!editedProfile) return;
    setEditedProfile({ ...editedProfile, email: value });
    if (value) validateEmail(value);
  };

  const toggleEdit = async () => {
    if (isEditing) {
      if (!validateNames() || !validateEmail(editedProfile?.email || "")) {
        return;
      }

      if (!editedProfile) return;

      try {
        const result = await updateProfile(editedProfile).unwrap();
        dispatch(
          profileApi.util.updateQueryData("getProfile", undefined, (draft) => {
            Object.assign(draft, result);
          })
        );
        setEditedProfile(result);
        setErrorMessage(null);
        setIsEditing(false);
      } catch (error) {
        console.error("Ошибка сохранения:", error);
        setErrorMessage("Не удалось сохранить изменения. Попробуйте ещё раз.");
      }
    } else {
      setIsEditing(true);
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <p>Ошибка загрузки профиля</p>;
  if (!profile || !editedProfile) return <p>Профиль не найден</p>;

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <ButtonToMain isEditing={isEditing} className="mb-10" />

      {errorMessage && (
        <p className="text-red-600 font-medium text-sm bg-red-50 border border-red-200 p-2 rounded">
          {errorMessage}
        </p>
      )}

      <div className="flex items-center justify-center bg-my-yellow-green px-6 py-3 rounded-xl mb-4">
        <label className="text-lg font-bold text-my-black">Мой профиль</label>
      </div>

      <div className="flex items-start gap-4 bg-my-light-green p-4 rounded-xl mb-4">
        <Avatar className="w-16 h-16 flex-shrink-0">
          <AvatarFallback>
            {getInitials(profile.name, profile.surname)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2 w-full min-w-0">
          {isEditing ? (
            <div className="space-y-2 w-full">
              <Input
                value={editedProfile.name}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    name: e.target.value,
                  })
                }
                placeholder="Имя"
                className="w-full bg-white"
                maxLength={32}
              />
              <Input
                value={editedProfile.surname}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    surname: e.target.value,
                  })
                }
                placeholder="Фамилия"
                className="w-full bg-white"
                maxLength={32}
              />
              {nameError && <p className="text-red-600 text-xs">{nameError}</p>}
            </div>
          ) : (
            <div className="space-y-1 min-w-0">
              <p className="text-lg truncate overflow-hidden">{profile.name}</p>
              <p className="text-lg truncate overflow-hidden">
                {profile.surname}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-my-light-green p-4 rounded-xl space-y-1 mb-4">
        <label className="text-sm text-gray-500">Логин</label>
        <p className="text-gray-900 truncate">{profile.login}</p>
      </div>

      <div className="bg-my-light-green p-4 rounded-xl space-y-1 mb-4">
        <label className="text-sm text-gray-500">Email</label>
        {isEditing ? (
          <>
            <Input
              value={editedProfile.email}
              onChange={handleEmailChange}
              placeholder="example@example.com"
              className="bg-white"
            />
            {emailError && (
              <p className="text-red-600 text-xs mt-1">{emailError}</p>
            )}
          </>
        ) : (
          <p className="text-gray-900 truncate">{profile.email}</p>
        )}
      </div>

      <div className="bg-my-light-green p-4 rounded-xl space-y-1 mb-4">
        <label className="text-sm text-gray-500">
          Комментарий для перевода
        </label>
        {isEditing ? (
          <Input
            value={editedProfile.comment_money_transfer || ""}
            onChange={(e) =>
              setEditedProfile({
                ...editedProfile,
                comment_money_transfer: e.target.value,
              })
            }
            placeholder="Комментарий"
            maxLength={128}
            className="bg-white"
          />
        ) : (
          <p className="text-gray-900 line-clamp-4 break-words">
            {profile.comment_money_transfer || "-"}
          </p>
        )}
      </div>

      <div className="mt-4">
        <Button onClick={toggleEdit} variant="dark_green" className="w-full">
          {isEditing ? "Сохранить" : "Редактировать"}
        </Button>
      </div>
    </div>
  );
};
