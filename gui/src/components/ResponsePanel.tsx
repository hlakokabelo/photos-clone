import { useState } from "react";
import { useResponseStore } from "../stores/responseStore";

type Tab = "body" | "headers";

export default function ResponsePanel() {
  const [tab, setTab] = useState<Tab>("body");

  const response = useResponseStore((s) => s.response);
  const loading = useResponseStore((s) => s.loading);
  const error = useResponseStore((s) => s.error);

  const successful =
    response !== null && response.status >= 200 && response.status < 300;

  return (
    <aside className="min-w-1/3 overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
        <h2 className="font-semibold">Response</h2>

        {loading ? (
          <span className="text-sm text-blue-500">Sending...</span>
        ) : response ? (
          <span
            className={`rounded-md px-2 py-1 text-xs font-semibold ${
              successful
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {response.status} {response.statusText}
          </span>
        ) : (
          <span className="text-sm text-slate-500">No response</span>
        )}
      </div>

      {response && (
        <div className="flex flex-wrap gap-4 border-b border-slate-200 px-4 py-2 text-xs text-slate-500 dark:border-slate-700">
          <span>{response.duration} ms</span>
          <span>{response.size && formatBytes(response.size)}</span>
        </div>
      )}

      <div className="flex border-b border-slate-200 dark:border-slate-700">
        {(["body", "headers"] as const).map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`px-4 py-3 text-sm capitalize ${
              tab === item
                ? "border-b-2 border-blue-500 font-semibold"
                : "text-slate-500"
            }`}
          >
            {item}
            {item === "headers" && response
              ? ` (${Object.keys(response.headers).length})`
              : ""}
          </button>
        ))}
      </div>

      <div className="max-h-130 min-h-64 overflow-auto p-4">
        {loading && !response ? (
          <p className="text-sm text-slate-500">Waiting for response...</p>
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        ) : !response ? (
          <div className="flex min-h-56 flex-col items-center justify-center gap-2 text-center">
            <span className="text-3xl text-slate-400">{"{}"}</span>
            <p className="font-medium">Nothing to display yet</p>
            <p className="text-sm text-slate-500">
              Send a request to inspect its response.
            </p>
          </div>
        ) : tab === "body" ? (
          <pre className="whitespace-pre-wrap wrap-break-word font-mono text-xs leading-6">
            {typeof response.body === "string"
              ? response.body
              : JSON.stringify(response.body, null, 2)}
          </pre>
        ) : (
          <div className="space-y-3">
            {Object.entries(response.headers).map(([key, value]) => (
              <div key={key} className="break-all text-sm">
                <p className="font-semibold">{key}</p>
                <p className="mt-1 font-mono text-xs text-slate-500">{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}
