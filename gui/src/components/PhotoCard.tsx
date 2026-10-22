import type { PhotoResponse } from "../types/photo";

interface Props {
  photo: PhotoResponse;
  onOpen: (id: number) => void;
}

export default function PhotoCard({ photo, onOpen }: Props) {
  return (
    <button
      onClick={() => onOpen(photo.id)}
      className="overflow-hidden rounded-xl bg-white text-left shadow transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <img
        src={photo.photoUrl}
        alt={photo.fileName}
        loading="lazy"
        className="aspect-square w-full bg-slate-100 object-cover"
      />
      <div className="p-3">
        <p className="truncate text-sm font-medium text-slate-900">
          {photo.fileName}
        </p>
        <p className="text-xs text-slate-500">{photo.contentType}</p>
      </div>
    </button>
  );
}
