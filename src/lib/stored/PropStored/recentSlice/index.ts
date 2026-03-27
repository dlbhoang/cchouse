import { StateCreator } from "zustand";

import { IPropResponse } from "@/lib/interfaces/Property/IProp";

type State = {
  recentData: IPropResponse[];
};

type Action = {
  onRecentDataChange: (item: IPropResponse) => void;
};
export type IRecentSlice = State & Action;

export const RecentSlice: StateCreator<IRecentSlice> = (set, get) => ({
  recentData: [],
  onRecentDataChange: (item) => {
    const currentArr = get().recentData;
    if (!currentArr.some((x) => x.Id === item.Id)) {
      const recentArr = [item, ...currentArr];
      if (recentArr.length > 5) recentArr.length = 5; // max 5
      set({ recentData: recentArr });
    }
  },
});
