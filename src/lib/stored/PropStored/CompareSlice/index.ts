import { StateCreator } from "zustand";

import { NotiBase } from "@/lib/components/shared/NotiBase";
import { IPropCompare } from "@/lib/interfaces/Property/IPropCompare";

type State = {
  listCompare: IPropCompare[];
  visible: boolean;
};

type Action = {
  toggleCompare: (item: IPropCompare) => void;
  reset: () => void;
  closeCompare: () => void;
};

export type ICompareSlice = State & Action;

export const CompareSlice: StateCreator<ICompareSlice> = (set, get) => ({
  listCompare: [],
  visible: false,
  toggleCompare: (item) => {
    const current = get().listCompare;
    if (current.some((x) => x.Id === item.Id)) {
      set({
        listCompare: current.filter((x) => x.Id !== item.Id),
        visible: true,
      });
      NotiBase("success", "Bỏ lưu so sánh thành công!");
    } else if (current.length > 4) {
      NotiBase("error", "So sánh tối đa 5 BĐS");
      set({
        visible: true,
      });
    } else {
      set({ listCompare: [...current, item], visible: true });
      NotiBase("success", "Lưu thành công!");
    }
  },
  reset: () => set({ listCompare: [], visible: false }),
  closeCompare: () => set({ visible: false }),
});
