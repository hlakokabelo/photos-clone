import type { PhotoResponse } from "../types/photo";
import PhotoCard from "./PhotoCard";

interface Props {
  photos: PhotoResponse[];
  loading: boolean;
  onOpen: (id: number) => void;
}

export default function PhotoGrid({ photos, loading, onOpen }: Props) {
  if (loading)
    return (
      <div
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        aria-busy="true"
        aria-label="Loading photos"
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="h-6 w-12 shrink-0 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="h-3 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-2.5 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    );

  if (!photos.length)
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="size-6"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="9" cy="10" r="1.5" />
            <path d="m21 15-4.5-4.5L7 20" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          No photos yet
        </p>
        <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
          Upload one above to get started — it will show up here.
        </p>
      </div>
    );

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {photos.map((p) => (
        <PhotoCard key={p.id} photo={p} onOpen={onOpen} />
      ))}
    </div>
  );
}
