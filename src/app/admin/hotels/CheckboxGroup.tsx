"use client";

interface CheckboxGroupProps {
  title: string;
  items: string[];
  name: string;
  selected?: string[];
}

export default function CheckboxGroup({ title, items, name, selected = [] }: CheckboxGroupProps) {
  return (
    <div className="mb-7 last:mb-0">
      <p className="text-[0.8rem] font-bold tracking-[0.16em] uppercase text-amber-500 mb-3">
        {title}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {items.map((item) => (
          <label
            key={item}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-sm text-black cursor-pointer hover:border-amber-500/60 hover:bg-amber-500/10 hover:text-amber-600 transition-all duration-150 select-none"
          >
            <input
              type="checkbox"
              name={name}
              value={item}
              defaultChecked={selected.includes(item)}
              className="accent-amber-500 w-3.5 h-3.5 shrink-0"
            />
            {item}
          </label>
        ))}
      </div>
    </div>
  );
}
