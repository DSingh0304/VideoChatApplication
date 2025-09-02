import { create } from 'zustand'

type ThemeState = {
  theme: string;
  setTheme: (theme: string) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (localStorage.getItem("streamify-theme") || "coffee") as string,
  setTheme: (theme: string) => {
    localStorage.setItem("streamify-theme", theme)
    set({ theme })
  },
}))