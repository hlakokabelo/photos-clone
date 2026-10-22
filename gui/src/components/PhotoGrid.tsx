import type { PhotoResponse } from "../types/photo";
import PhotoCard from "./PhotoCard";

interface Props {
  photos: PhotoResponse[];
  loading: boolean;
  onOpen: (id: number) => void;
}

export default function PhotoGrid({ photos, loading, onOpen }: Props) {
  if (loading)
    return <p className="py-12 text-center text-slate-500">Loading photos…</p>;
  if (!photos.length)
    return (
      <p className="py-12 text-center text-slate-500">
        No photos yet. Upload one above.
      </p>
    );
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {photos.map((p) => (
        <PhotoCard key={p.id} photo={p} onOpen={onOpen} />
      ))}
    </div>
  );
}
