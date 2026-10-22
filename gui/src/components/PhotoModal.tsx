import { useEffect, useState } from "react";
import type { PhotoResponse } from "../types/photo";
import { getPhoto } from "../services/photoService";
import { downloadPhoto } from "../services/downloadService";

interface Props {
  photoId: number;
  onClose: () => void;
}

export default function PhotoModal({ photoId, onClose }: Props) {
  const [photo, setPhoto] = useState<PhotoResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getPhoto(photoId)
      .then(setPhoto)
      .catch((e) => setError(e.message));
  }, [photoId]);

  async function download() {
    if (!photo) return;
    try {
      await downloadPhoto(photo.id, photo.fileName);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed");
    }
  }

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-full w-full max-w-2xl overflow-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900 dark:ring-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="size-5"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <circle cx="9" cy="10" r="1.5" />
                <path d="m21 15-4.5-4.5L7 20" />
              </svg>
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Photo details
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Preview and download this photo.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:focus-visible:ring-offset-slate-900"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="size-5"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        {photo ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <p className="font-medium text-slate-900 dark:text-slate-100">
              {photo.fileName}
            </p>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {photo.contentType}
            </p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
              #{photo.id}
            </span>
          </div>
        ) : (
          !error && (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 py-12 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
              <span className="size-4 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-500 dark:border-slate-600 dark:border-t-indigo-400" />
              Loading…
            </div>
          )
        )}

        {error && (
          <p
            role="alert"
            className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:border-red-900/70 dark:bg-red-950/60 dark:text-red-300"
          >
            <span aria-hidden="true" className="mt-px">
              ⚠
            </span>
            {error}
          </p>
        )}

        <div className="mt-5 flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
          <button
            onClick={download}
            disabled={!photo}
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-b from-indigo-500 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-600/25 transition hover:from-indigo-400 hover:to-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-slate-900"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="size-4"
              aria-hidden="true"
            >
              <path d="M12 3v12m-5-5 5 5 5-5" />
              <path d="M5 16v4h14v-4" />
            </svg>
            Download
          </button>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-white dark:focus-visible:ring-offset-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
