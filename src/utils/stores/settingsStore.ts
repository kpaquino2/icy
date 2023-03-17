import { create } from "zustand";
import { persist } from "zustand/middleware";

type GeneralSettings = {
  semcount: number;
  yrstart: number;
  hasmidyear: boolean;
};

interface SettingsStore {
  general: GeneralSettings;
  setGeneral: (g: GeneralSettings) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      general: {
        semcount: 2,
        yrstart: 1,
        hasmidyear: true,
      },
      setGeneral: (g) => set({ general: g }),
    }),
    { name: "icysettings" }
  )
);
