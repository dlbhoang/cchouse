import { StateCreator } from 'zustand';

type State = {
  visibleBirthday: boolean;
};

type Action = {
  showHappyBirthdayModal: () => void;
  hiddenHappyBirthdayModal: () => void;
};

export type IHappyBirthdaySlice = State & Action;

export const HappyBirthdaySlice: StateCreator<IHappyBirthdaySlice> = (set) => ({
  visibleBirthday: false,
  showHappyBirthdayModal: () => set({ visibleBirthday: true }),
  hiddenHappyBirthdayModal: () => set({ visibleBirthday: false }),
});
