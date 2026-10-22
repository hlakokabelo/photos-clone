import { useEffect, useState } from "react";
import type { PhotoResponse } from "../types/photo";
import { deletePhoto, getPhoto } from "../services/photoService";
import { downloadPhoto } from "../services/downloadService";

interface Props {
  photoId: number;
  onClose: () => void;
  onDeleted: () => void;
}

export default function PhotoModal({ photoId, onClose, onDeleted }: Props) {
  const [photo, setPhoto] = useState<PhotoResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getPhoto(photoId)
      .then(setPhoto)
      .catch((e) => setError(e.message));
  }, [photoId]);

  async function remove() {
    if (!confirm("Delete this photo?")) return;
    try {
      await deletePhoto(photoId);
      onDeleted();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

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
      className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-full w-full max-w-2xl overflow-auto rounded-xl bg-white p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {photo ? (
          <>
            <img
              src={photo.photoUrl}
              alt={photo.fileName}
              className="max-h-[60vh] w-full rounded object-contain"
            />
            <p className="mt-3 font-medium text-slate-900">{photo.fileName}</p>
            <p className="text-sm text-slate-500">{photo.contentType}</p>
          </>
        ) : (
          !error && <p className="py-12 text-center text-slate-500">Loading…</p>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={download}
            disabled={!photo}
            className="rounded-md bg-slate-100 px-4 py-2 text-sm hover:bg-slate-200 disabled:opacity-50"
          >
            Download
          </button>
          <button
            onClick={remove}
            disabled={!photo}
            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
