import { ReactNode } from "react";

export default function HotelLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen">
      {children}
    </main>
  );
}