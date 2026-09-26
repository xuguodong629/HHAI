import { create } from "zustand";

type UIState = {
  collapsed: boolean;
  searchQuery: string;
  toggleSidebar: () => void;
  setSearchQuery: (query: string) => void;
};

export const useUIStore = create<UIState>((set) => ({
  collapsed: false,
  searchQuery: "",
  toggleSidebar: () => set((state) => ({ collapsed: !state.collapsed })),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));