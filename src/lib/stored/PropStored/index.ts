import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { HappyBirthdaySlice, IHappyBirthdaySlice } from './CheckBirthday';
import { CompareSlice, ICompareSlice } from './CompareSlice';
import { CountOldSlice, ICountOldSlice } from './CountOldProp';
import { IRecentSlice, RecentSlice } from './recentSlice/index';
import { ISearchHistorySlice, SearchHistorySlice } from './search-history';

export const usePropStore = create(
  persist<
    ICompareSlice &
      ICountOldSlice &
      IRecentSlice &
      ISearchHistorySlice &
      IHappyBirthdaySlice
  >(
    (...a) => ({
      ...CompareSlice(...a),
      ...CountOldSlice(...a),
      ...RecentSlice(...a),
      ...HappyBirthdaySlice(...a),
      ...SearchHistorySlice(...a),
    }),
    { name: 'prop-storage' }
  )
);
