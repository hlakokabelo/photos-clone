import type { PhotoFilters as Filters } from "../types/photo";

interface Props {
  value: Filters;
  onChange: (f: Filters) => void;
  onSearch: () => void;
}

export default function PhotoFilters({ value, onChange, onSearch }: Props) {
  const input =
    "rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/15";

  const label =
    "text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400";

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex min-w-0 flex-col gap-1">
        <label htmlFor="filter-file-name" className={label}>
          File name
        </label>
        <input
          id="filter-file-name"
          className={`${input} w-full sm:w-56`}
          placeholder="e.g. sunset"
          value={value.fileName}
          onChange={(e) => onChange({ ...value, fileName: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
        />
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        <label htmlFor="filter-content-type" className={label}>
          Content type
        </label>
        <input
          id="filter-content-type"
          className={`${input} w-full sm:w-56`}
          placeholder="e.g. image/png"
          value={value.contentType}
          onChange={(e) => onChange({ ...value, contentType: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="filter-limit" className={label}>
          Limit
        </label>
        <input
          id="filter-limit"
          className={`${input} w-24`}
          type="number"
          min={1}
          value={value.limit}
          onChange={(e) =>
            onChange({ ...value, limit: Number(e.target.value) || 1 })
          }
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
        />
      </div>

      <button
        onClick={onSearch}
        className="ml-auto inline-flex items-center gap-2 rounded-xl bg-linear-to-b from-indigo-500 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-600/25 transition hover:from-indigo-400 hover:to-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="size-4"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        Search
      </button>
    </div>
  );
}
