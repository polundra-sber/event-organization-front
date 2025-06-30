"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

type SelectButtonProps = {
  isSelected?: boolean;
  onSelect?: () => void;
  href?: string;
  className?: string;
  label?: string;
};

export const SelectButton = ({
  isSelected = false,
  onSelect,
  href,
  className,
  label = "Выбрать",
}: SelectButtonProps) => {
  const [selected, setSelected] = useState(isSelected);

  const handleClick = () => {
    const newState = !selected;
    setSelected(newState);
    if (onSelect) {
      onSelect();
    }
  };

  return href ? (
    <Button
      variant={selected ? "secondary" : "default"}
      size="sm"
      asChild
      className={className}
      onClick={handleClick}
    >
      <Link href={href}>
        {selected ? "✓ Выбрано" : label}
      </Link>
    </Button>
  ) : (
    <Button
      variant={selected ? "secondary" : "default"}
      size="sm"
      className={className}
      onClick={handleClick}
    >
      {selected ? "✓ Выбрано" : label}
    </Button>
  );
};