"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useGetEventParticipantsListQuery } from "@/lib/api/participants-api";
import { toast } from "sonner";

interface ParticipantsPickerModalProps {
  eventId: number;
  onSubmit: (logins: string[]) => void;
  onCancel: () => void;
}

export function ParticipantsPickerModal({
  eventId,
  onSubmit,
  onCancel,
}: ParticipantsPickerModalProps) {
  const { data: participants = [], isLoading } = useGetEventParticipantsListQuery(eventId);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [searchValue, setSearchValue] = React.useState("");

  React.useEffect(() => {
    setSelected([]);
  }, [onSubmit, onCancel]);

  const toggleSelect = (login: string) => {
    setSelected((prev) =>
      prev.includes(login)
        ? prev.filter((l) => l !== login)
        : [...prev, login]
    );
  };

  const handleSelectAll = () => {
    setSelected(participants.map(p => p.login));
  };

  const handleClearAll = () => {
    setSelected([]);
  };

  const filteredParticipants = React.useMemo(() => {
    if (!searchValue) return participants;
    
    const searchLower = searchValue.toLowerCase();
    return participants.filter((participant) => {
      return (
        participant.login.toLowerCase().includes(searchLower) ||
        participant.email.toLowerCase().includes(searchLower) ||
        participant.name?.toLowerCase().includes(searchLower) ||
        participant.surname?.toLowerCase().includes(searchLower) ||
        `${participant.surname || ""} ${participant.name || ""}`
          .toLowerCase()
          .trim()
          .includes(searchLower)
      );
    });
  }, [participants, searchValue]);

  const getDisplayName = (participant: any) => {
    const nameParts = [];
    if (participant.surname) nameParts.push(participant.surname);
    if (participant.name) nameParts.push(participant.name);
    const nameStr =
      nameParts.length > 0 ? nameParts.join(" ") : participant.login;
    return `${nameStr} (${participant.email})`;
  };

  const handleSubmit = () => {
    if (selected.length === 0) {
      toast.warning("Выберите хотя бы одного участника");
      return;
    }
    onSubmit(selected);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        <h2 className="text-lg font-bold mb-4">Выберите участников</h2>
        
        <Command shouldFilter={false} className="flex-1 overflow-hidden">
          <CommandInput
            placeholder="Поиск по логину, email, имени или фамилии..."
            className="h-9 mb-2"
            value={searchValue}
            onValueChange={setSearchValue}
            disabled={isLoading}
          />
          
          <div className="flex flex-row gap-2 w-full mt-2 mb-2">
            <Button
              variant="bright_green"
              size="sm"
              onClick={handleSelectAll}
              disabled={isLoading}
              className="flex-1 h-8"
            >
              Выбрать всех
            </Button>
            <Button
              variant="bright_green"
              size="sm"
              onClick={handleClearAll}
              disabled={isLoading}
              className="flex-1 h-8"
            >
              Очистить
            </Button>
          </div>
          
          <CommandEmpty>Участник не найден</CommandEmpty>
          
          <CommandGroup className="overflow-y-auto max-h-[300px]">
            {isLoading ? (
              <div className="py-2 text-center text-sm text-gray-500">
                Загрузка участников...
              </div>
            ) : (
              filteredParticipants.map((participant) => (
                <CommandItem
                  key={participant.login}
                  value={participant.login}
                  onSelect={() => toggleSelect(participant.login)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(participant.login)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {getDisplayName(participant)}
                </CommandItem>
              ))
            )}
          </CommandGroup>
        </Command>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selected.length === 0 || isLoading}
            variant="dark_green"
          >
            Добавить ({selected.length})
          </Button>
        </div>
      </div>
    </div>
  );
}