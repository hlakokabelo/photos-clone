import { create } from "zustand";

interface ApiStatusState {
  isAwake: boolean | null;
  isPinging: boolean;
  error: string | null;
  pingApi: () => Promise<void>;
}

const API_URL =
  import.meta.env.VITE_API_URL ?? "https://photos-clone-api.onrender.com";

export const useApiStatusStore = create<ApiStatusState>((set) => ({
  isAwake: null,
  isPinging: false,
  error: null,

  pingApi: async () => {
    set({ isPinging: true, error: null });

    try {
      const response = await fetch(`${API_URL}/api/ping`);

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      await response.text();

      set({
        isAwake: true,
        isPinging: false,
        error: null,
      });
    } catch (error) {
      set({
        isAwake: false,
        isPinging: false,
        error:
          error instanceof Error ? error.message : "Unable to reach the API",
      });
    }
  },
}));
