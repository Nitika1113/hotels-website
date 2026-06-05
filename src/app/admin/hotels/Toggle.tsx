"use client";
import { useState } from "react";

interface ToggleProps {
  name: string;
  label: string;
  checked?: boolean;
  onChange?: (v: boolean) => void;
}

export default function Toggle({ name, label, checked, onChange }: ToggleProps) {
  const [on, setOn] = useState(!!checked);
  return (
    <label className="group inline-flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          name={name}
          checked={on}
          onChange={(e) => { setOn(e.target.checked); onChange?.(e.target.checked); }}
          className="sr-only"
        />
        <div className={`w-10 h-6 rounded-full border transition-all duration-200 ${on ? "bg-amber-500/25 border-amber-500" : "bg-stone-100 border-stone-300"}`} />
        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-all duration-200 ${on ? "translate-x-4 bg-amber-500" : "bg-stone-400"}`} />
      </div>
      <span className="text-[0.8rem] text-stone-700 group-hover:text-amber-600 transition-colors duration-150">
        {label}
      </span>
    </label>
  );
}
