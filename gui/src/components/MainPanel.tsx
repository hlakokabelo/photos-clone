import { useCallback, useEffect, useState } from "react";
import type { PhotoFilters as Filters, PhotoResponse } from "../types/photo.ts";
import AuthForm from "./AuthForm.tsx";
import UploadForm from "./UploadForm.tsx";
import PhotoFilters from "./PhotoFilters.tsx";
import PhotoGrid from "./PhotoGrid.tsx";
import PhotoModal from "./PhotoModal";
import { getToken, setToken } from "../lib/tokenStore.ts";
import { listPhotos } from "../services/photoService.ts";
import DownloadForm from "./DownloadForm.tsx";

type PanelKey = "filter" | "upload" | "download" | "auth";

/* --- shared toggle styles (secondary buttons) --- */
const toggleBase =
  "inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900";

const toggleIdle =
  "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-white";

const toggleActive =
  "border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/30 shadow-indigo-500/10 dark:border-indigo-400 dark:bg-indigo-950/60 dark:text-indigo-200 dark:ring-indigo-400/30";

const toggleClass = (active: boolean) =>
  `${toggleBase} ${active ? toggleActive : toggleIdle}`;

/* --- upload is the primary CTA, so its "open" style is a brighter gradient + ring --- */
const uploadBase =
  "inline-flex cursor-pointer items-center gap-2 rounded-xl bg-linear-to-b px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900";

const uploadIdle =
  "from-indigo-500 to-indigo-600 shadow-indigo-600/25 hover:from-indigo-400 hover:to-indigo-500";

const uploadActive =
  "from-indigo-600 to-indigo-700 shadow-indigo-700/30 ring-2 ring-indigo-400/60 ring-offset-2 ring-offset-white hover:from-indigo-500 hover:to-indigo-600 dark:ring-offset-slate-900";

const MainPanel = () => {
  const [token, setTokenState] = useState<string | null>(getToken());
  const [photos, setPhotos] = useState<PhotoResponse[]>([]);
  const [filters, setFilters] = useState<Filters>({
    fileName: "",
    contentType: "",
    limit: 1000,
  });

  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelKey | null>(null);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);

  /* derived — guarantees only one panel is ever open */
  const showUpload = activePanel === "upload";
  const showDownload = activePanel === "download";
  const showFilterPhotos = activePanel === "filter";
  const showAuth = activePanel === "auth";

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

  /** Open `panel`, or close it if it's already the active one. */
  function handleSetShow(panel: PanelKey) {
    setActivePanel((prev) => (prev === panel ? null : panel));
  }

  function handleLogin(t: string) {
    setToken(t);
    setTokenState(t);
    // close the auth panel once the user is logged in,
    // otherwise it would reappear on the next logout
    setActivePanel(null);
  }

  useEffect(() => {
    load();
  }, []);

  function logout() {
    setToken(null);
    setTokenState(null);
    setPhotos([]);
    setOpenId(null);
    setActivePanel(null);
  }

  return (
    <main className="min-w-0 space-y-6">
      <div className="flex w-fit flex-wrap items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/80 p-2 shadow-sm ring-1 ring-black/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:ring-white/5">
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-white dark:focus-visible:ring-offset-slate-900"
        >
          <span aria-hidden="true">↻</span>
          {loading ? "Fetching..." : "Fetch photos"}
        </button>

        <button
          type="button"
          onClick={() => handleSetShow("filter")}
          aria-expanded={showFilterPhotos}
          aria-controls="filter-section"
          className={toggleClass(showFilterPhotos)}
        >
          Filter Photos
        </button>

        <button
          type="button"
          onClick={() => handleSetShow("upload")}
          aria-expanded={showUpload}
          aria-controls="upload-section"
          className={`${uploadBase} ${showUpload ? uploadActive : uploadIdle}`}
        >
          <span aria-hidden="true">↑</span>
          Upload photo
        </button>

        <button
          type="button"
          onClick={() => handleSetShow("download")}
          aria-expanded={showDownload}
          aria-controls="download-section"
          className={toggleClass(showDownload)}
        >
          <span aria-hidden="true">↓</span>
          {downloading ? "Downloading..." : "Download"}
        </button>

        {token ? (
          <button
            type="button"
            onClick={logout}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-transparent bg-transparent px-3.5 py-2 text-sm font-medium text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-400 dark:hover:border-rose-900/60 dark:hover:bg-rose-950/50 dark:hover:text-rose-300 dark:focus-visible:ring-offset-slate-900"
          >
            Log out
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleSetShow("auth")}
            aria-expanded={showAuth}
            aria-controls="auth-section"
            className={toggleClass(showAuth)}
          >
            Authenticate
          </button>
        )}

        <a
          href="https://photos-clone-api.onrender.com/api"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-white dark:focus-visible:ring-offset-slate-900"
        >
          API
        </a>
      </div>

      {showAuth && !token && (
        <section
          id="auth-section"
          className="scroll-mt-24 rounded-2xl border border-slate-200 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <AuthForm onLoggedIn={handleLogin} />
        </section>
      )}

      {showUpload && (
        <section
          id="upload-section"
          className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <UploadForm onUploaded={load} />
        </section>
      )}

      {showDownload && (
        <section
          id="download-section"
          className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <DownloadForm
            loading={downloading}
            setLoading={setDownloading}
            error={error}
          />
        </section>
      )}

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Your photos
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {photos.length} {photos.length === 1 ? "photo" : "photos"} loaded
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/60 dark:text-indigo-300">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
            {photos.length}
          </span>
        </div>

        {showFilterPhotos && (
          <div id="filter-section" className="scroll-mt-24">
            <PhotoFilters value={filters} onChange={setFilters} onSearch={load} />
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm dark:border-red-900/70 dark:bg-red-950/60 dark:text-red-300"
          >
            <span aria-hidden="true" className="mt-px">
              ⚠
            </span>
            {error}
          </p>
        )}

        <PhotoGrid photos={photos} loading={loading} onOpen={setOpenId} />
      </section>

      {openId !== null && (
        <PhotoModal photoId={openId} onClose={() => setOpenId(null)} />
      )}
    </main>
  );
};

export default MainPanel;