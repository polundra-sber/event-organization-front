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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ConfirmationDialog } from "../common/ConfirmationDialog";
import { LogOut } from "lucide-react";
import {
  validateEmail,
  validateName,
  validateSurname,
  validateMoneyTransfer,
} from "@/lib/validation/auth-validation";

export const ProfilePageContent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);

  const { data: profile, isLoading, isError } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const dispatch = useDispatch();

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Вы успешно вышли из профиля");
    router.push("/");
  };

  useEffect(() => {
    if (profile) {
      setEditedProfile(profile);
    }
  }, [profile]);

  const validateForm = () => {
    if (!editedProfile) return false;

    // Validate name
    const nameValidation = validateName(editedProfile.name);
    if (!nameValidation.valid) {
      setNameError(nameValidation.message || null);
      return false;
    }

    // Validate surname
    const surnameValidation = validateSurname(editedProfile.surname);
    if (!surnameValidation.valid) {
      setNameError(surnameValidation.message || null);
      return false;
    }

    // Validate email
    const emailValidation = validateEmail(editedProfile.email);
    if (!emailValidation.valid) {
      setEmailError(emailValidation.message || null);
      return false;
    }

    setNameError(null);
    setEmailError(null);
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!editedProfile) return;
    setEditedProfile({ ...editedProfile, email: value });
    const { valid, message } = validateEmail(value);
    setEmailError(valid ? null : message || null);
  };

  const toggleEdit = async () => {
    if (isEditing) {
      if (!validateForm()) {
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
      <div className="flex justify-between items-start mb-4">
        <ButtonToMain isEditing={isEditing} />
        <Button variant="dark_green" onClick={() => setLogoutDialogOpen(true)}>
          <LogOut className="h-4 w-4" />
          Выйти
        </Button>
      </div>

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
                maxLength={50}
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
                maxLength={50}
              />
              {nameError && <p className="text-red-600 text-xs">{nameError}</p>}
            </div>
          ) : (
            <div className="space-y-1 min-w-0">
              <p className="text-lg break-words whitespace-normal">
                {profile.name}
              </p>
              <p className="text-lg break-words whitespace-normal">
                {profile.surname}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-my-light-green p-4 rounded-xl space-y-1 mb-4">
        <label className="text-sm text-gray-500">Логин</label>
        <p className="text-gray-900 break-words whitespace-normal">
          {profile.login}
        </p>
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
              maxLength={254}
            />
            {emailError && (
              <p className="text-red-600 text-xs mt-1">{emailError}</p>
            )}
          </>
        ) : (
          <p className="text-gray-900 break-words whitespace-normal">
            {profile.email}
          </p>
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
          <p className="text-gray-900 break-words whitespace-normal">
            {profile.comment_money_transfer || "-"}
          </p>
        )}
      </div>

      <div className="mt-4">
        <Button onClick={toggleEdit} variant="dark_green" className="w-full">
          {isEditing ? "Сохранить" : "Редактировать"}
        </Button>
      </div>

      <ConfirmationDialog
        isOpen={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        title="Вы действительно хотите выйти?"
        description="Для доступа к профилю потребуется снова войти в систему."
        onConfirm={handleLogout}
        confirmLabel="Выйти"
        cancelLabel="Отмена"
      />
    </div>
  );
};