import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { IPreviewSlice, PreviewSlice } from './PreviewSlice';

export const useFeedStored = create(
  persist<IPreviewSlice>(
    (...a) => ({
      ...PreviewSlice(...a),
    }),
    {
      name: 'feed-sessionStorage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
