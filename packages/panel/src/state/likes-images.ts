import create from "zustand";
import { persist } from "zustand/middleware";

export type State = {
    thumbSize: number;
    updateThumbSize: (thumbSize: number) => void;
};

export const useLikedImages = create<State>(persist((set, _) => ({
    thumbSize: 120,
    updateThumbSize: (thumbSize: number) => set(() => ({ thumbSize }))
}), { name: 'likes-thumbs-config' }));
