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
      participant.email.toLowerCase().includes(searchLower) ||
      participant.name.toLowerCase().includes(searchLower) ||
      participant.surname.toLowerCase().includes(searchLower) ||
      `${participant.surname} ${participant.name}`
        .toLowerCase()
        .includes(searchLower)
    );
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedParticipant
            ? `${selectedParticipant.surname} ${selectedParticipant.name} (${selectedParticipant.email})`
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Поиск по email, имени или фамилии..."
            className="h-9"
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandEmpty>Участник не найден</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
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
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === participant.login ? "opacity-100" : "opacity-0"
                  )}
                />
                {`${participant.surname} ${participant.name} (${participant.email})`}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
