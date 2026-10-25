import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background-color,color,box-shadow,transform] duration-300 ease-out-expo disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:size-[1.05em] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-forest text-on-forest hover:bg-forest-deep shadow-soft",
        accent: "bg-terracotta-ink text-paper hover:brightness-110 shadow-soft",
        outline: "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-paper",
        ghost: "text-ink hover:bg-sand/70",
        light: "bg-paper text-ink hover:bg-sand",
        whatsapp: "bg-[#1E7D4B] text-white hover:bg-[#17663D] shadow-soft",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-[0.95rem]",
        lg: "h-14 px-7 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});
Button.displayName = "Button";
