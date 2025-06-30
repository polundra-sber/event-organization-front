"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useGetProfileQuery, useUpdateProfileMutation, api } from "@/lib/api/api";
import { useDispatch } from "react-redux";
import { ButtonToMain } from "@/components/common/ButtonToMain";
import { UserEditor, UserProfile } from "@/lib/types";

function getInitials(firstName: string, lastName: string) {
  const firstInitial = firstName?.charAt(0).toUpperCase() || "?";
  const lastInitial = lastName?.charAt(0).toUpperCase() || "?";
  return `${firstInitial}.${lastInitial}`;
}

function getChangedFields(original: Partial<UserEditor>, edited: Partial<UserEditor>) {
  const changed: Partial<UserEditor> = {};
  for (const key in edited) {
    if (edited[key as keyof UserEditor] !== original[key as keyof UserEditor]) {
      changed[key as keyof UserEditor] = edited[key as keyof UserEditor];
    }
  }
  return changed;
}

export const ProfilePageContent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [editedProfile, setEditedProfile] = useState<UserEditor>({});

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
    if (!editedProfile.firstName?.trim() || !editedProfile.lastName?.trim()) {
      setNameError("Имя и фамилия не могут быть пустыми");
      return false;
    }
    setNameError(null);
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedProfile({ ...editedProfile, email: value });
    if (value) validateEmail(value);
  };

  const toggleEdit = async () => {
    if (isEditing) {
      // Валидация перед сохранением
      if (!validateNames() || !validateEmail(editedProfile.email || "")) {
        return;
      }

      const changedFields = getChangedFields(profile, editedProfile);
      if (Object.keys(changedFields).length === 0) {
        setIsEditing(false);
        return;
      }

      try {
        const result = await updateProfile(changedFields).unwrap();
        dispatch(
          api.util.updateQueryData("getProfile", undefined, (draft) => {
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

  if (isLoading) return <p>Загрузка профиля...</p>;
  if (isError) return <p>Ошибка загрузки профиля</p>;

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <ButtonToMain isEditing={isEditing} />

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
        {errorMessage && (
          <p className="text-red-600 font-medium text-sm bg-red-50 border border-red-200 p-2 rounded">
            {errorMessage}
          </p>
        )}

        <div className="flex items-start gap-4 bg-pink-100 p-4 rounded-xl">
          <Avatar className="w-16 h-16 flex-shrink-0">
            <AvatarFallback>
              {getInitials(profile.firstName, profile.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2 w-full min-w-0">
            {isEditing ? (
              <div className="space-y-2 w-full">
                <div>
                  <Input
                    value={editedProfile.firstName || ""}
                    onChange={(e) => {
                      setEditedProfile({ ...editedProfile, firstName: e.target.value });
                      if (e.target.value.trim()) setNameError(null);
                    }}
                    placeholder="Имя"
                    className="w-full bg-white"
                    maxLength={32}
                  />
                </div>
                <div>
                  <Input
                    value={editedProfile.lastName || ""}
                    onChange={(e) => {
                      setEditedProfile({ ...editedProfile, lastName: e.target.value });
                      if (e.target.value.trim()) setNameError(null);
                    }}
                    placeholder="Фамилия"
                    className="w-full bg-white"
                    maxLength={32}
                  />
                </div>
                {nameError && (
                  <p className="text-red-600 text-xs">{nameError}</p>
                )}
              </div>
            ) : (
              <div className="space-y-1 min-w-0">
                <p className="text-xl font-semibold truncate overflow-hidden">
                  {profile.firstName}
                </p>
                <p className="text-xl font-semibold truncate overflow-hidden">
                  {profile.lastName}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-pink-100 p-4 rounded-xl space-y-1">
          <label className="text-sm text-gray-500">Логин</label>
          <p className="text-gray-900 truncate">{profile.login}</p>
        </div>

        <div className="bg-pink-100 p-4 rounded-xl space-y-1">
          <label className="text-sm text-gray-500">Email</label>
          {isEditing ? (
            <>
              <Input
                value={editedProfile.email || ""}
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

        <div className="bg-pink-100 p-4 rounded-xl space-y-1">
          <label className="text-sm text-gray-500">Реквизиты</label>
          {isEditing ? (
            <Input
              value={editedProfile.requisites || ""}
              onChange={(e) =>
                setEditedProfile({ ...editedProfile, requisites: e.target.value })
              }
              placeholder="Реквизиты"
              maxLength={128}
              className="bg-white"
            />
          ) : (
            <p className="text-gray-900 line-clamp-4 break-words">
              {profile.requisites}
            </p>
          )}
        </div>

        <div className="mt-4">
          <Button onClick={toggleEdit} variant="dark_pink" className="w-full">
            {isEditing ? "Сохранить" : "Редактировать"}
          </Button>
        </div>
      </div>
    </div>
  );
};