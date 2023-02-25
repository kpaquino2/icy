import { create } from "zustand";

type Mode = "SELECT" | "MOVE" | "CONNECT";

interface ModeStore {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

export const useModeStore = create<ModeStore>()((set) => ({
  mode: "SELECT",
  setMode: (mode) => set({ mode: mode }),
}));
