import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface State {
  isDrawerOpen: boolean;
}

interface Actions {
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

export const useDrawerStore = create(
  immer<State & Actions>((set) => ({
    isDrawerOpen: false,
    openDrawer: () =>
      set((state) => {
        state.isDrawerOpen = true;
      }),

    closeDrawer: () =>
      set((state) => {
        state.isDrawerOpen = false;
      }),

    toggleDrawer: () =>
      set((state) => {
        state.isDrawerOpen = !state.isDrawerOpen;
      }),
  }))
);
