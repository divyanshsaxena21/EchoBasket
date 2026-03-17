// src/store/appStore.ts

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AppStoreState {
  sidebarOpen: boolean;
  darkMode: boolean;
  isOnline: boolean;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
  setDarkMode: (dark: boolean) => void;
  setIsOnline: (online: boolean) => void;
}

export const useAppStore = create<AppStoreState>()(
  devtools(
    (set) => ({
      sidebarOpen: true,
      darkMode: false,
      isOnline: true,

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      toggleDarkMode: () => {
        set((state) => ({ darkMode: !state.darkMode }));
      },

      setDarkMode: (dark: boolean) => {
        set({ darkMode: dark });
      },

      setIsOnline: (online: boolean) => {
        set({ isOnline: online });
      },
    }),
    { name: 'AppStore' },
  ),
);
