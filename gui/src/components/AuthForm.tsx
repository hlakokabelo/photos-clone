import { useState } from "react";
import { login, register } from "../services/authService";

interface Props {
  onLoggedIn: (token: string) => void;
}

export default function AuthForm({ onLoggedIn }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (mode === "register") {
        await register(username, password);
        setMode("login");
        setNotice("Account created. Log in to continue.");
      } else {
        onLoggedIn(await login(username, password));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  const input =
    "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/15";

  return (
    <div className="mx-auto  w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900 dark:ring-white/5">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="size-5"
            aria-hidden="true"
          >
            <path d="M7 11V8a5 5 0 0 1 10 0v3" />
            <rect x="4" y="11" width="16" height="10" rx="2" />
          </svg>
        </div>

        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {mode === "login" ? "Log in" : "Create account"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {mode === "login"
              ? "Welcome back — sign in to continue."
              : "Set up an account to upload and manage photos."}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <input
          className={input}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className={input}
          type="password"
          placeholder={
            mode === "register" ? "Password (min 8 characters)" : "Password"
          }
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:border-red-900/70 dark:bg-red-950/60 dark:text-red-300"
          >
            {error}
          </p>
        )}
        {notice && (
          <p
            role="status"
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/60 dark:text-emerald-300"
          >
            {notice}
          </p>
        )}
        <button
          onClick={submit}
          disabled={busy || !username || !password}
          className="w-full rounded-xl bg-linear-to-b from-indigo-500 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/25 transition hover:from-indigo-400 hover:to-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-slate-900"
        >
          {busy
            ? "Please wait…"
            : mode === "login"
              ? "Log in"
              : "Create account"}
        </button>
      </div>
      <button
        onClick={() => setMode(mode === "login" ? "register" : "login")}
        className="mt-4 text-sm font-medium text-indigo-600 transition hover:text-indigo-700 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        {mode === "login"
          ? "Need an account? Register"
          : "Have an account? Log in"}
      </button>
    </div>
  );
}
