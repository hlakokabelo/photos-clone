import { useState } from "react";
import { downloadPhoto } from "../services/downloadService";
import { useResponseStore } from "../stores/responseStore";

type DownloadFormProps = {
  loading?: boolean;
  setLoading: (state: boolean) => void;
  error?: string;
};

export default function DownloadForm({
  loading = false,
  error = "",
  setLoading,
}: DownloadFormProps) {
  const [photoId, setPhotoId] = useState("");
  const [validationError, setValidationError] = useState("");
  const { setResponse } = useResponseStore();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const id = Number(photoId);

    if (!photoId.trim() || !Number.isInteger(id) || id <= 0) {
      setValidationError("Enter a valid positive photo ID.");
      return;
    }
    setLoading(true);
    setValidationError("");
    await downloadPhoto(id, undefined, setResponse);
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="size-5"
            aria-hidden="true"
          >
            <path d="M12 3v12m-5-5 5 5 5-5" />
            <path d="M5 16v4h14v-4" />
          </svg>
        </div>

        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">
            Download a photo
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter the ID of the photo you want to download.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <label
          htmlFor="download-photo-id"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Photo ID
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="download-photo-id"
            type="number"
            min="1"
            step="1"
            value={photoId}
            onChange={(e) => {
              setPhotoId(e.target.value);
              setValidationError("");
            }}
            placeholder="e.g. 12"
            className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/15"
          />

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-b from-indigo-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/25 transition hover:from-indigo-400 hover:to-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-slate-900"
          >
            {loading ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Downloading...
              </>
            ) : (
              "Download"
            )}
          </button>
        </div>

        {(validationError || error) && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:border-red-900/70 dark:bg-red-950/60 dark:text-red-300"
          >
            {validationError || error}
          </p>
        )}
      </form>
    </section>
  );
}
