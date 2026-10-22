import type { PhotoResponse } from "../types/photo";

interface Props {
  photo: PhotoResponse;
  onOpen: (id: number) => void;
}

export default function PhotoCard({ photo, onOpen }: Props) {
  return (
    <button
      type="button"
      onClick={() => onOpen(photo.id)}
      aria-label={`View photo ${photo.fileName}, ID ${photo.id}`}
      className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700 dark:focus-visible:ring-offset-slate-950"
    >
      <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200 transition group-hover:bg-indigo-50 group-hover:text-indigo-700 group-hover:ring-indigo-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:group-hover:bg-indigo-950/60 dark:group-hover:text-indigo-300 dark:group-hover:ring-indigo-900/70">
        #{photo.id}
      </span>

      <div className="min-w-0 flex-1">
        <p
          className="wrap-break-word text-sm font-medium text-slate-900 transition group-hover:text-indigo-700 dark:text-slate-100 dark:group-hover:text-indigo-300"
          title={photo.fileName}
        >
          {photo.fileName}
        </p>
        <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
          {photo.contentType}
        </p>
      </div>

      <span
        aria-hidden="true"
        className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500 dark:text-slate-600 dark:group-hover:text-indigo-400"
      >
        →
      </span>
    </button>
  );
}
