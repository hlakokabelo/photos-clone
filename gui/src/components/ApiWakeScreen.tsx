import { useEffect } from "react";
import { useApiStatusStore } from "../stores/apiStatusStore";

export default function ApiWakeScreen() {
  const { isAwake, isPinging, error, pingApi } = useApiStatusStore();

  useEffect(() => {
    if (isAwake === null && !isPinging) {
      void pingApi();
    }
  }, [isAwake, isPinging, pingApi]);

  if (isAwake) return null;

  return (
    <div className="fixed inset-0 z-9999 flex min-h-screen flex-col items-center justify-center bg-white/80 px-6 text-center dark:bg-gray-950/80 ">
      {/* Loading animation */}
      <div className="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />

      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
        {error ? "Unable to connect" : "Waking up the API..."}
      </h1>

      <p className="mt-2 max-w-sm text-sm text-gray-600 dark:text-gray-400">
        {error
          ? "The server isn't responding. Check your connection and try again."
          : "Please wait while we get everything ready for you."}
      </p>

      {error && (
        <button
          onClick={() => void pingApi()}
          disabled={isPinging}
          className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPinging ? "Trying again..." : "Try again"}
        </button>
      )}
    </div>
  );
}
