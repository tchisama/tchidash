import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative",
  {
    variants: {
      variant: {
        default: "bg-[#008060] text-white hover:bg-[#006e52] shadow-[0_1px_0_0_rgba(0,0,0,0.1)] before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-b before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        destructive: "bg-[#d82c0d] text-white hover:bg-[#b32500] shadow-[0_1px_0_0_rgba(0,0,0,0.1)] before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-b before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        outline: "border border-[#e3e3e3] bg-white text-[#42474c] hover:bg-[#f6f6f7] hover:border-[#c9c9c9] shadow-[0_1px_0_0_rgba(0,0,0,0.05)]",
        secondary: "bg-[#f6f6f7] text-[#42474c] hover:bg-[#e3e3e3] shadow-[0_1px_0_0_rgba(0,0,0,0.05)]",
        ghost: "text-[#42474c] hover:bg-[#f6f6f7]",
        link: "text-[#008060] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
