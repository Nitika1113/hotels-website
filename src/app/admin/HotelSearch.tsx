"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HotelSearch({
  defaultValue,
}: {
  defaultValue?: string;
}) {
  const router = useRouter();

  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(defaultValue || "");
  }, [defaultValue]);

  function handleSearch(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const query = value.trim();

    if (!query) {
      router.push("/admin/hotels");
      return;
    }

    router.push(
      `/admin/hotels?q=${encodeURIComponent(
        query
      )}`
    );
  }

  return (
    <form
      onSubmit={handleSearch}
      className="mb-6 flex gap-3"
    >
      <input
        type="text"
        value={value}
        onChange={(e) =>
          setValue(e.target.value)
        }
        placeholder="Search hotel, city, property type..."
        className="flex-1 rounded-2xl border border-gray-200 bg-white px-5 py-4 outline-none focus:border-black"
      />

      <button
        type="submit"
        className="rounded-2xl bg-black px-6 text-white hover:opacity-90"
      >
        Search
      </button>
    </form>
  );
}