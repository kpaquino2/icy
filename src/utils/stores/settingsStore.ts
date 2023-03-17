import { create } from "zustand";
import { persist } from "zustand/middleware";

type GeneralSettings = {
  semcount: number;
  yrstart: number;
  hasmidyear: boolean;
};

type AppearanceSettings = {
  dark: boolean;
  animateConnections: boolean;
};

interface SettingsStore {
  general: GeneralSettings;
  appearance: AppearanceSettings;
  setGeneral: (g: GeneralSettings) => void;
  setAppearance: (a: AppearanceSettings) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      general: {
        semcount: 2,
        yrstart: 1,
        hasmidyear: true,
      },
      appearance: {
        dark: false,
        animateConnections: true,
      },
      setGeneral: (g) => set({ general: g }),
      setAppearance: (a) => set({ appearance: a }),
    }),
    { name: "icysettings" }
  )
);
