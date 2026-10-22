import { useRef, useState } from "react";
import { uploadPhoto } from "../services/photoService";

interface Props {
  onUploaded: () => void;
}

export default function UploadForm({ onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function pick(file?: File) {
    setError("");
    if (!file) return setPreview(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function upload() {
    if (!preview) return;
    setBusy(true);
    setError("");
    try {
      // Sends the full data URL ("data:image/png;base64,..."). If your API wants
      await uploadPhoto(preview);
      setPreview(null);
      if (inputRef.current) inputRef.current.value = "";
      onUploaded();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
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
            <path d="M12 21V9m-5 5 5-5 5 5" />
            <path d="M5 4h14" />
          </svg>
        </div>

        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">
            Upload a photo
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Choose an image file, preview it, then upload.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => pick(e.target.files?.[0])}
          className="max-w-full text-sm text-slate-600 outline-none transition file:mr-3 file:cursor-pointer file:rounded-xl file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-700 file:shadow-sm file:transition hover:file:bg-indigo-100 focus-visible:file:ring-2 focus-visible:file:ring-indigo-500 focus-visible:file:ring-offset-2 dark:text-slate-300 dark:file:bg-indigo-950/60 dark:file:text-indigo-300 dark:hover:file:bg-indigo-900/60 dark:focus-visible:file:ring-offset-slate-900"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="h-12 w-12 rounded-lg object-cover ring-2 ring-indigo-100 dark:ring-indigo-900/60"
          />
        )}

        <button
          onClick={upload}
          disabled={!preview || busy}
          className="ml-auto inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-b from-indigo-500 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-600/25 transition hover:from-indigo-400 hover:to-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-slate-900"
        >
          {busy ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Uploading…
            </>
          ) : (
            <>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="size-4"
                aria-hidden="true"
              >
                <path d="M12 21V9m-5 5 5-5 5 5" />
                <path d="M5 4h14" />
              </svg>
              Upload photo
            </>
          )}
        </button>
      </div>

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
    </section>
  );
}
