import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;

  className?: string;
}

export default function Container({
  children,
  className = "",
}: ContainerProps) {
  return (
    <div
      className={`
        w-full
        max-w-350
        mx-auto
        px-5
        sm:px-6
        lg:px-10
        xl:px-14
        ${className}
      `}
    >
      {children}
    </div>
  );
}