"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User } from "@/lib/api/types/auth-types";

interface ParticipantSelectProps {
  participants: User[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  className?: string;
}

export function ParticipantSelect({
  participants,
  value,
  onChange,
  placeholder = "Выберите участника...",
  className,
}: ParticipantSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const selectedParticipant = participants.find(
    (participant) => participant.login === value
  );

  const filteredParticipants = participants.filter((participant) => {
    if (!searchValue) return true;

    const searchLower = searchValue.toLowerCase();
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

  const getDisplayName = (participant: User) => {
    const nameParts = [];
    if (participant.surname) nameParts.push(participant.surname);
    if (participant.name) nameParts.push(participant.name);

    const nameStr =
      nameParts.length > 0 ? nameParts.join(" ") : participant.login;
    return `${nameStr} (${participant.email})`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between truncate text-left",
            className
          )}
        >
          <span className="truncate block w-[calc(100%-20px)]">
            {selectedParticipant
              ? getDisplayName(selectedParticipant)
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        side="bottom" // Изменено с default на "bottom"
        sideOffset={4} // Небольшой отступ от триггера
        avoidCollisions={false} // Отключаем автоматическое изменение позиции
      >
        <Command shouldFilter={false} className="max-h-[250px] overflow-hidden">
          <CommandInput
            placeholder="Поиск по логину, email, имени или фамилии..."
            className="h-9"
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandEmpty className="py-2 px-4 text-sm text-muted-foreground">
            Участник не найден
          </CommandEmpty>
          <CommandGroup className="overflow-y-auto max-h-[250px]">
            <CommandItem
              key="none"
              value=""
              onSelect={() => {
                onChange(null);
                setOpen(false);
                setSearchValue("");
              }}
              className="whitespace-normal break-words min-w-0"
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4 flex-shrink-0",
                  value === null ? "opacity-100" : "opacity-0"
                )}
              />
              <span className="flex-1 min-w-0">Не назначен</span>
            </CommandItem>
            {filteredParticipants.map((participant) => (
              <CommandItem
                key={participant.login}
                value={participant.login}
                onSelect={() => {
                  onChange(
                    participant.login === value ? null : participant.login
                  );
                  setOpen(false);
                  setSearchValue("");
                }}
                className="whitespace-normal break-words min-w-0"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4 flex-shrink-0",
                    value === participant.login ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="flex-1 min-w-0">
                  {getDisplayName(participant)}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}