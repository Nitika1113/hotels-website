import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;

  variant?: "primary" | "secondary" | "outline" | "social";

  size?: "sm" | "md" | "lg";

  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700",

    secondary:
      "bg-gray-200 text-black hover:bg-gray-300",

    outline:
      "border border-gray-300 bg-white text-black hover:bg-gray-50",

    social:
      "border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 shadow-sm",
  };

  const sizes = {
    sm: "h-9 px-4 text-sm rounded-lg",

    md: "h-11 px-5 text-sm rounded-xl",

    lg: "h-12 px-6 text-base rounded-xl",
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}