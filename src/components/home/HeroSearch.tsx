"use client";

import { useRouter } from "next/navigation";

import {
  Search,
  ChevronDown,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function HeroSearch() {

  const router = useRouter();


  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // LOCATION
  const [location, setLocation] =
    useState("");

  // DATES
  const [checkIn, setCheckIn] =
    useState<Date | null>(null);

  const [checkOut, setCheckOut] =
    useState<Date | null>(null);

  // GUESTS
  const [adults, setAdults] =
    useState(1);

  const [children, setChildren] =
    useState(0);

  const [rooms, setRooms] =
    useState(1);

  const [pets, setPets] =
    useState(false);

  // DROPDOWN
  const [guestOpen, setGuestOpen] =
    useState(false);

  // LOCATION SUGGESTIONS
  const [suggestions, setSuggestions] =
    useState<string[]>([]);


  if (!mounted) return null;

  // LOCATION SEARCH
  const handleLocationChange = async (
    value: string
  ) => {

    setLocation(value);

    if (!value.trim()) {

      setSuggestions([]);

      return;

    }

    try {

      const response = await fetch(
        `/api/search-location?q=${value}`
      );

      const result =
        await response.json();

      setSuggestions(
        result.data || []
      );

    } catch (error) {

      console.log(error);

    }
  };

  // SEARCH
  const handleSearch = () => {

    const query =
      new URLSearchParams({

        location,

        checkIn:
          checkIn?.toISOString() ||
          "",

        checkOut:
          checkOut?.toISOString() ||
          "",

        adults: adults.toString(),

        children:
          children.toString(),

        rooms: rooms.toString(),

        pets: pets.toString(),

      });

    router.push(
      `/hotels?${query.toString()}`
    );
  };

  return (
    <div
      className="
        mt-10
        bg-white
        rounded-[20px]

        px-6
        py-4

        shadow-[0_20px_60px_rgba(0,0,0,0.12)]

        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-[1fr_0.8fr_0.8fr_1.3fr_0.6fr]

        gap-6
        items-center

        max-w-7xl
        mx-auto
      "
    >

      {/* LOCATION */}
      <div className="relative flex flex-col">

        <label
          className="
            text-sm
            font-medium
            text-gray-900
            mb-2
            
          "
        >
          Destination
        </label>

        <input
          type="text"
          placeholder="Where are you going?"
          value={location}
          onChange={(e) =>
            handleLocationChange(
              e.target.value
            )
          }
          className="
            h-12
            px-5
            rounded-2xl
            border
            border-gray-300
          bg-[#c29b6a]/10  
            text-black
            outline-none
            hover:border-black
            focus:border-black
            focus:shadow-md
            transition-all
          "
        />

        {/* LOCATION DROPDOWN */}
        {suggestions.length > 0 && (
          <div
            className="
              absolute
              top-full
              left-0
              mt-3
              w-full
              bg-white
              border
              hover:shadow-xl
              border-gray-300
              rounded-3xl
              shadow-[0_20px_60px_rgba(0,0,0,0.15)]
              overflow-hidden
              z-50
            "
          >

            {suggestions.map(
              (item) => (

                <button
                  key={item}
                  type="button"
                  onClick={() => {

                    setLocation(item);

                    setSuggestions([]);

                  }}
                  className="
                    w-full
                    text-left
                    px-5
                    cursor-pointer
                    py-4
                    hover:bg-yellow-50
                    text-black
                    
                    transition
                  "
                >
                  {item}
                </button>

              )
            )}

          </div>
        )}

      </div>

      {/* CHECK IN */}
      <div className="flex flex-col">

        <label
          className="
            text-sm
            font-medium
            text-gray-900
            mb-2
            
          "
        >
          Check In
        </label>

        <DatePicker
          selected={checkIn}
          onChange={(
            date: Date | null
          ) =>
            setCheckIn(date)
          }
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={new Date()}
          placeholderText="Select date"
          dateFormat="dd MMM yyyy"
          className="
            h-12
            w-full
            px-5
            rounded-2xl
             bg-[#c29b6a]/10
            border
            cursor-pointer
            border-gray-300
            outline-none
             text-black
             hover:border-black
            focus:border-black
            focus:shadow-md
            transition-all
          "
        />

      </div>

      {/* CHECK OUT */}
      <div className="flex flex-col">

        <label
          className="
            text-sm
            font-medium
            text-gray-900
            mb-2
          "
        >
          Check Out
        </label>

        <DatePicker
          selected={checkOut}
          onChange={(
            date: Date | null
          ) =>
            setCheckOut(date)
          }
          selectsEnd
          startDate={checkIn}
          endDate={checkOut}
          minDate={
            checkIn || new Date()
          }
          placeholderText="Select date"
          dateFormat="dd MMM yyyy"
          className="
            h-12
            w-full
            px-5
            cursor-pointer
            rounded-2xl
            border
             bg-[#c29b6a]/10
            border-gray-300
            outline-none
            text-black
            focus:border-black
             hover:border-black
            focus:shadow-md
            transition-all
          "
        />

      </div>

      {/* GUESTS */}
      <div className="relative flex  flex-col">

        <label
          className="
            text-sm
            font-medium
            text-gray-900
            mb-2
          "
        >
          Guests & Rooms
        </label>

        <button
          type="button"
          onClick={() =>
            setGuestOpen(
              !guestOpen
            )
          }
          className="
            h-12
            px-6
            rounded-2xl
            cursor-pointer
            border
            border-gray-300
            bg-[#c29b6a]/10
            flex
            items-center
            justify-between
            text-left
            hover:border-black
            hover:shadow-md
            transition-all
          "
        >

          <div className="flex flex-col ">

            <span
              className="
                text-black
                font-semibold
                text-sm
              "
            >
              {adults + children}
              {" "}Guests ·{" "}
              {rooms}
              {" "}
              {rooms > 1
                ? "Rooms"
                : "Room"}

              {pets
                ? " · Pet Friendly"
                : ""}
            </span>

            <span
              className="
                text-xs
                text-gray-500
                mt-1
              "
            >
              Add guests & rooms
            </span>

          </div>

          <ChevronDown
            size={18}
            className={`
              transition-transform
              duration-300
              text-black
              ${
                guestOpen
                  ? "rotate-180"
                  : ""
              }
            `}
          />

        </button>

        {/* DROPDOWN */}
        {guestOpen && (
          <div
            className="
              absolute
              top-full
              left-0
              mt-3
              w-[320px]

              bg-white
              rounded-3xl
              shadow-[0_20px_60px_rgba(0,0,0,0.15)]

              border
              border-gray-300

              p-6
              z-50
              space-y-6
            "
          >

            {/* ADULTS */}
            <CounterRow
              title="Adults"
              subtitle="Age 18+"
              value={adults}
              onDecrease={() =>
                setAdults(
                  Math.max(
                    1,
                    adults - 1
                  )
                )
              }
              onIncrease={() =>
                setAdults(
                  adults + 1
                )
              }
            />

            {/* CHILDREN */}
            <CounterRow
              title="Children"
              subtitle="Age 0-18"
              value={children}
              onDecrease={() =>
                setChildren(
                  Math.max(
                    0,
                    children - 1
                  )
                )
              }
              onIncrease={() =>
                setChildren(
                  children + 1
                )
              }
            />

            {/* ROOMS */}
            <CounterRow
              title="Rooms"
              subtitle="Number of rooms"
              value={rooms}
              onDecrease={() =>
                setRooms(
                  Math.max(
                    1,
                    rooms - 1
                  )
                )
              }
              onIncrease={() =>
                setRooms(
                  rooms + 1
                )
              }
            />

            {/* PETS */}
            <div
              className="
                flex
                items-center
                justify-between
                pt-4
                border-t
              "
            >

              <div>

                <h4
                  className="
                    font-semibold
                    text-black
                    flex justify-start items-start
                  "
                >
                  Pets
                </h4>

                <p
                  className="
                    text-sm
                    text-gray-500
                  "
                >
                  Pet-friendly stays
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setPets(!pets)
                }
                className={`
                  w-14
                  h-7
                  rounded-full
                  px-1
                  flex
                  cursor-pointer
                  items-center
                  transition-all

                  ${
                    pets
                      ? "bg-[#d4b794] justify-end"
                      : "bg-gray-300 justify-start"
                  }
                `}
              >

                <div
                  className="
                    w-5
                    h-5
                    bg-white
                    rounded-full
                  "
                />

              </button>

            </div>

            {/* DONE */}
            <button
              type="button"
              onClick={() =>
                setGuestOpen(false)
              }
              className="
                w-full
                h-11
                rounded-2xl
                   bg-[#c29b6a]/30
            cursor-pointer
                text-black
                font-medium
              
                transition
                hover:bg-[#d4b794]
              "
            >
              Done
            </button>

          </div>
        )}

      </div>

      {/* SEARCH */}
      <button
        onClick={handleSearch}
        className="
          h-12
          rounded-full
           bg-[#c29b6a]/10
          text-black
          hover:bg-[#d4b794]
          hover:border-black
          flex
          cursor-pointer
          items-center
          justify-center
          gap-2
          transition-all
          font-semibold
          shadow-lg
          
        "
      >

        <Search size={18} />

        Search

      </button>

    </div>
  );
}

interface CounterRowProps {
  title: string;
  subtitle: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

function CounterRow({
  title,
  subtitle,
  value,
  onDecrease,
  onIncrease,
}: CounterRowProps) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
      "
    >

      <div>

        <h4
          className="
            font-semibold
            text-black
            flex justify-start items-start
          "
        >
          {title}
        </h4>

        <p
          className="
            text-sm
            text-gray-500
          "
        >
          {subtitle}
        </p>

      </div>

      <div
        className="
          flex
          items-center
          gap-4
        "
      >

        <button
          type="button"
          onClick={onDecrease}
          className="
            w-10
            h-10
            rounded-full
            border
            border-gray-300
            text-xl
            bg-[#c29b6a]/30
            hover:border-black
            transition
            cursor-pointer
            text-black
          "
        >
          -
        </button>

        <span
          className="
            w-5
            text-center
            font-medium
            text-black
          "
        >
          {value}
        </span>

        <button
          type="button"
          onClick={onIncrease}
          className="
            w-10
            h-10
            rounded-full
            border
            bg-[#c29b6a]/30
            border-gray-300
            text-xl
            cursor-pointer
            hover:border-black
            transition
            text-black
          "
        >
          +
        </button>

      </div>

    </div>
  );
}