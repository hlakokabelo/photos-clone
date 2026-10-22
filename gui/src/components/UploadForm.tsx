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
      // raw base64 only, use: preview.split(",")[1]
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
    <div className="flex flex-wrap items-center gap-3 rounded-xl bg-white p-4 shadow">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => pick(e.target.files?.[0])}
        className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm hover:file:bg-slate-200"
      />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="h-12 w-12 rounded object-cover"
        />
      )}
      <button
        onClick={upload}
        disabled={!preview || busy}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {busy ? "Uploading…" : "Upload photo"}
      </button>
      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </div>
  );
}
