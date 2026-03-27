import { StateCreator } from "zustand";
import { ISuggestAddressDto } from "@/lib/interfaces/base/IBase";

type State = {
  searchHistories: ISuggestAddressDto[];
};

type Action = {
  onSearchHistoryChange: (item: ISuggestAddressDto) => void;
};
export type ISearchHistorySlice = State & Action;

export const SearchHistorySlice: StateCreator<ISearchHistorySlice> = (
  set,
  get
) => ({
  searchHistories: [],
  onSearchHistoryChange: (item) => {
    const currentArr = get().searchHistories;
    if (
      !currentArr.some(
        (x) =>
          x.ProvinceId === item.ProvinceId &&
          x.DistrictId === item.DistrictId &&
          x.WardId === item.WardId
      )
    ) {
      const recentArr = [item, ...currentArr];
      if (recentArr.length > 5) recentArr.length = 5; // max 5
      set({ searchHistories: recentArr });
    }
  },
});
