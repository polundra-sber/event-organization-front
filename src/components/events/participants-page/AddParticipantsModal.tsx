"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchUsersQuery } from "@/lib/api/participants-api";
import { UserDemo } from "@/lib/api/types/participants-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Check, Plus, ChevronDown, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PAGE_SIZE = 10;

interface AddParticipantsModalProps {
  event_id: number;
  onAddParticipants: (logins: string[]) => Promise<void>;
  existingParticipants: string[];
}

export const AddParticipantsModal = ({
  event_id,
  onAddParticipants,
  existingParticipants,
}: AddParticipantsModalProps) => {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<UserDemo[]>([]);
  const [page, setPage] = useState(0);
  const [loadedUsers, setLoadedUsers] = useState<UserDemo[]>([]);

  const debouncedSearch = useDebounce(searchText, 500);

  const {
    data: users,
    isLoading,
    isFetching,
  } = useSearchUsersQuery(
    {
      event_id,
      text: debouncedSearch,
      seq: page,
    },
    { skip: debouncedSearch.length === 0 }
  );

  useEffect(() => {
    if (users) {
      setLoadedUsers((prev) => {
        if (page === 0) {
          return users;
        } else {
          const newUsers = users.filter(
            (user) => !prev.some((u) => u.login === user.login)
          );
          return [...prev, ...newUsers];
        }
      });
    }
  }, [users, page]);

  const handleSelectUser = useCallback((user: UserDemo) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.login === user.login)
        ? prev.filter((u) => u.login !== user.login)
        : [...prev, user]
    );
  }, []);

  const handleAddParticipants = async () => {
    if (selectedUsers.length === 0) return;

    try {
      await onAddParticipants(selectedUsers.map((u) => u.login));
      setSelectedUsers([]);
      setSearchText("");
      setPage(0);
      setLoadedUsers([]);
      setOpen(false);
    } catch (error) {
      console.error("Error adding participants:", error);
    }
  };

  const isAlreadyParticipant = useCallback(
    (login: string) => {
      return existingParticipants.includes(login);
    },
    [existingParticipants]
  );

  useEffect(() => {
    if (open) {
      setSearchText("");
      setSelectedUsers([]);
      setPage(0);
      setLoadedUsers([]);
    }
  }, [open]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch]);

  const canLoadMore = users?.length === PAGE_SIZE;

  const filteredLoadedUsers = useMemo(() => {
    return loadedUsers.filter(
      (user) => !selectedUsers.some((u) => u.login === user.login)
    );
  }, [loadedUsers, selectedUsers]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="bright_green" className="gap-2">
          <Plus size={16} />
          Добавить участника
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Добавить участников</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Поиск участников..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          {selectedUsers.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Выбрано: {selectedUsers.length}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs ml-auto"
                  onClick={() => setSelectedUsers([])}
                >
                  Очистить
                </Button>
              </div>
              <ScrollArea className="h-20 rounded-md border p-2">
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <Badge
                      key={user.login}
                      variant="outline"
                      className="px-2 py-0.5 text-xs flex items-center gap-1"
                    >
                      <span className="inline-block max-w-[120px] truncate">
                        {user.name} {user.surname}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectUser(user);
                        }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          <ScrollArea className="h-64 rounded-md border">
            {debouncedSearch.length === 0 ? (
              <div className="flex justify-center p-4">
                <p className="text-muted-foreground">
                  Введите текст для поиска
                </p>
              </div>
            ) : isLoading && page === 0 ? (
              <div className="flex justify-center p-4">
                <p>Загрузка...</p>
              </div>
            ) : loadedUsers.length === 0 ? (
              <div className="flex justify-center p-4">
                <p>Ничего не найдено</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredLoadedUsers.map((user) => {
                  const isExisting = isAlreadyParticipant(user.login);

                  return (
                    <div
                      key={user.login}
                      className={`p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${
                        isExisting ? "opacity-50" : ""
                      }`}
                      onClick={() => !isExisting && handleSelectUser(user)}
                    >
                      <div className="min-w-0">
                        <p className="font-medium break-all">
                          {user.name} {user.surname}
                        </p>
                        <p className="text-sm text-muted-foreground break-all">
                          {user.login} • {user.email}
                        </p>
                      </div>

                      {isExisting ? (
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          Уже участник
                        </span>
                      ) : selectedUsers.some((u) => u.login === user.login) ? (
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      ) : null}
                    </div>
                  );
                })}

                {canLoadMore && (
                  <div className="p-3 flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPage((prev) => prev + 1)}
                      disabled={isFetching}
                    >
                      {isFetching ? (
                        "Загрузка..."
                      ) : (
                        <>
                          <ChevronDown className="mr-2 h-4 w-4" />
                          Загрузить еще
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          <Button
            className="w-full"
            onClick={handleAddParticipants}
            disabled={selectedUsers.length === 0}
          >
            Добавить выбранных ({selectedUsers.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};