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
      console.log(e);
    } finally {
      setBusy(false);
    }
  }

  const input =
    "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

  return (
    <div className="mx-auto mt-24 w-full max-w-sm rounded-xl bg-white p-6 shadow">
      <h1 className="mb-4 text-xl font-semibold text-slate-900">
        {mode === "login" ? "Log in" : "Create account"}
      </h1>
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
        {error && <p className="text-sm text-red-600">{error}</p>}
        {notice && <p className="text-sm text-green-700">{notice}</p>}
        <button
          onClick={submit}
          disabled={busy || !username || !password}
          className="w-full rounded-md bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
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
        className="mt-4 text-sm text-indigo-600 hover:underline"
      >
        {mode === "login"
          ? "Need an account? Register"
          : "Have an account? Log in"}
      </button>
    </div>
  );
}
