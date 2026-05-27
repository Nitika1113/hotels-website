"use client";

import { useState } from "react";

export default function useNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return {
    isOpen,
    toggleMenu,
    closeMenu,
  };
}