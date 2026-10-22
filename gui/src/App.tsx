import ApiWakeScreen from "./components/ApiWakeScreen";
import MainPanel from "./components/MainPanel";

export default function App() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white text-slate-900 antialiased dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
      <ApiWakeScreen />
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-md supports-backdrop-filter:bg-white/60 dark:border-slate-800/80 dark:bg-slate-950/70 dark:supports-backdrop-filter:bg-slate-950/50">
        <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-linear-to-b from-indigo-500 to-indigo-600 text-white shadow-sm shadow-indigo-600/25 ring-1 ring-inset ring-white/10">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="size-5"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
            </div>

            <div>
              <h1 className="font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Photos-clone-gui
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                API resource manager
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-screen-2xl gap-6 p-4 sm:p-6">
        <MainPanel />

        {/**       
         *  <aside className="min-w-0 xl:sticky xl:top-24">
              <ResponsePanel />
            </aside>
        */}
      </div>
    </div>
  );
}
