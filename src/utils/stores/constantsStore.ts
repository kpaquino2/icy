import { create } from "zustand";
import { persist } from "zustand/middleware";

type Mode = "SELECT" | "MOVE" | "CONNECT";

interface ConstantsStore {
  mode: Mode;
  zoom: number;
  setMode: (mode: Mode) => void;
  setZoom: (p: number) => void;
}

export const useConstantsStore = create<ConstantsStore>()(
  persist(
    (set) => ({
      mode: "SELECT",
      zoom: 1.0,
      setMode: (mode) => set({ mode: mode }),
      setZoom: (p) => set({ zoom: p }),
    }),
    { name: "constants" }
  )
);
