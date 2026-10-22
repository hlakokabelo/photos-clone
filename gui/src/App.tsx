import { useCallback, useEffect, useState } from "react";
import type { PhotoFilters as Filters, PhotoResponse } from "./types/photo.ts";
import AuthForm from "./components/AuthForm.tsx";
import UploadForm from "./components/UploadForm.tsx";
import PhotoFilters from "./components/PhotoFilters.tsx";
import PhotoGrid from "./components/PhotoGrid.tsx";
import PhotoModal from "./components/PhotoModal";
import { getToken, setToken } from "./lib/tokenStore.ts";
import { listPhotos } from "./services/photoService.ts";

export default function App() {
  const [token, setTokenState] = useState<string | null>(getToken());
  const [photos, setPhotos] = useState<PhotoResponse[]>([]);
  const [filters, setFilters] = useState<Filters>({
    fileName: "",
    contentType: "",
    limit: 1000,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setPhotos(await listPhotos(filters));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load photos");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load once after login; filters apply when the Search button is pressed.
  useEffect(() => {
    if (token) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function handleLogin(t: string) {
    setToken(t);
    setTokenState(t);
  }

  function logout() {
    setToken(null);
    setTokenState(null);
    setPhotos([]);
  }

  if (!token) return <AuthForm onLoggedIn={handleLogin} />;

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Photos</h1>
        <button
          onClick={logout}
          className="text-sm text-slate-600 hover:underline"
        >
          Log out
        </button>
      </header>
      <UploadForm onUploaded={load} />
      <PhotoFilters value={filters} onChange={setFilters} onSearch={load} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <PhotoGrid photos={photos} loading={loading} onOpen={setOpenId} />
      {openId !== null && (
        <PhotoModal
          photoId={openId}
          onClose={() => setOpenId(null)}
          onDeleted={() => {
            setOpenId(null);
            load();
          }}
        />
      )}
    </div>
  );
}
