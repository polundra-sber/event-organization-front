import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium 
  transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none 
  [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring 
  focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 
  aria-invalid:border-destructive active:scale-[0.98]`, // Общий эффект нажатия для всех кнопок
  {
    variants: {
      variant: {
        default:
          "bg-my-dark-green text-primary-foreground shadow-xs hover:bg-primary/90 active:bg-primary/80",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 active:bg-destructive/80 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-my-light-green shadow-xs hover:bg-accent hover:text-accent-foreground active:bg-accent/90 dark:bg-input/30 dark:border-input dark:hover:bg-input/50 dark:active:bg-input/70",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/90 active:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground active:bg-accent/80 dark:hover:bg-accent/50 dark:active:bg-accent/70",
        link: "text-primary underline-offset-4 hover:underline active:text-primary/80",
        dark_green: 
          "bg-my-dark-green text-white font-bold hover:bg-my-dark-green/90 active:bg-my-dark-green/80",
        light_green: 
          "bg-my-light-green text-secondary-foreground font-bold hover:bg-my-light-green/90 active:bg-my-light-green/80",
        yellow_green: 
          "bg-my-yellow-green text-secondary-foreground font-bold hover:bg-my-yellow-green/90 active:bg-my-yellow-green/80",
        bright_green: 
          "bg-my-bright-green text-black font-bold hover:bg-my-bright-green/90 active:bg-my-bright-green/80",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }