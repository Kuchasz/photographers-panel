import { replace } from "@pp/utils/array";
import create from "zustand";

type Id = string;

export type UploadedImage = {
    id: Id;
    blogId: number;
    processed: boolean;
    current: boolean;
    processing: boolean;
    progress?: number;
    file: File;
    error?: string;
}

export type State = {
    images: UploadedImage[],
    uploadImages: (image: { id: Id, blogId: number, file: File }[]) => void,
    updateImage: (id: Id) => (changes: Partial<UploadedImage>) => void
}

export const useUploadedImages = create<State>(set => ({
    images: [],
    uploadImages: (images) => set(state => ({
        images: [...state.images, ...images.map(i => ({ ...i, error: undefined, current: false, processed: false, processing: false, progress: undefined }))]
    })),
    updateImage: (id) => (changes) => set(state => {
        const image = state.images.find(x => x.id === id);
        if (!image) return state;
        return ({
            images: replace(
                state.images,
                image,
                { ...image, ...changes }, 
                x => x.id)
        });
    })
}));