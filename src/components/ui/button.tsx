import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Button Component - Consistent interactive element styling
 * 
 * Variants:
 * - default: Primary action (blue background, white text)
 * - secondary: Secondary action (light gray background)
 * - destructive: Destructive action (red background)
 * - outline: Bordered button (blue border, blue text)
 * - ghost: Minimal button (no background, blue text on hover)
 * - link: Link-like button (underlined text)
 * 
 * Sizes:
 * - sm: Small button (h-9)
 * - default: Default button (h-10)
 * - lg: Large button (h-11)
 * - icon: Icon-only button (h-10 w-10)
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /** Primary action: Blue background, white text with shadow */
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg",
        /** Destructive action: Red background */
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        /** Outlined button: Border only */
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        /** Secondary action: Light gray background */
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        /** Ghost button: Transparent, hover effect only */
        ghost: "hover:bg-accent hover:text-accent-foreground",
        /** Link button: Underlined text */
        link: "text-primary underline-offset-4 hover:underline",
        /** Brand blue button */
        blue: "bg-kc-blue text-white hover:bg-kc-blue-dark shadow-md hover:shadow-lg transition-all duration-300",
        /** Brand red accent button */
        red: "bg-kc-red text-white hover:bg-kc-red-dark shadow-md hover:shadow-lg transition-all duration-300",
        /** Black outline button with invert on hover */
        blackOutline: "border-2 border-kc-black text-kc-black bg-white hover:bg-kc-black hover:text-white transition-all duration-300",
      },
      size: {
        sm: "h-9 rounded-md px-3",
        default: "h-10 px-4 py-2",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

