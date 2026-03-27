import { StateCreator } from "zustand";

import { IFeedResponse } from "@/services/api/feed/IFeed";

type State = {
  preview?: IFeedResponse;
  images: string[];
};

type Action = {
  setPreview: (item: IFeedResponse) => void;
  setImages: (images: string[]) => void;
};

export type IPreviewSlice = State & Action;

export const PreviewSlice: StateCreator<IPreviewSlice> = (set, get) => ({
  images: [],
  setPreview: (item) => set({ preview: { ...item } }),
  setImages: (images) => set({ images }),
});
