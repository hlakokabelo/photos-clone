import type { PhotoFilters as Filters } from "../types/photo";

interface Props {
  value: Filters;
  onChange: (f: Filters) => void;
  onSearch: () => void;
}

export default function PhotoFilters({ value, onChange, onSearch }: Props) {
  const input =
    "rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        className={input}
        placeholder="File name"
        value={value.fileName}
        onChange={(e) => onChange({ ...value, fileName: e.target.value })}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
      <input
        className={input}
        placeholder="Content type (e.g. image/png)"
        value={value.contentType}
        onChange={(e) => onChange({ ...value, contentType: e.target.value })}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
      <input
        className={`${input} w-24`}
        type="number"
        min={1}
        value={value.limit}
        onChange={(e) =>
          onChange({ ...value, limit: Number(e.target.value) || 1 })
        }
      />
      <button
        onClick={onSearch}
        className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900"
      >
        Search
      </button>
    </div>
  );
}
