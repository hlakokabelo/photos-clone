import { create } from "zustand";

export type ApiResponse = {
  status: number;
  statusText: string;
  duration?: number;
  headers: Record<string, string>;
  body: unknown;
  size?: number;
  url: string;
};

type ResponseStore = {
  response: ApiResponse | null;
  loading: boolean;
  error: string | null;
  setResponse: (response: ApiResponse) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearResponse: () => void;
};

export const useResponseStore = create<ResponseStore>((set) => ({
  response: null,
  loading: false,
  error: null,

  setResponse: (response) => set({ response, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearResponse: () => set({ response: null, error: null, loading: false }),
}));
