"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const MyListsMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" x2="21" y1="6" y2="6" />
            <line x1="3" x2="21" y1="12" y2="12" />
            <line x1="3" x2="21" y1="18" y2="18" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem asChild>
          <Link href="/my-purchases">Мои покупки</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/my-stuffs">Мои вещи</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/my-tasks">Мои задачи</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/my-debts">Мои долги</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/my-incomes">Мне должны</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
