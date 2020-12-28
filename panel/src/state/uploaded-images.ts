import { distinctBy, replace, union } from "@pp/utils/array";
import { v4 } from "@pp/utils/uuid";
import create from "zustand";

type Id = string;

export type UploadedImage = {
    id?: number;
    url?: string;
    originId: Id;
    blogId: number;
    processed: boolean;
    current: boolean;
    processing: boolean;
    progress: number;
    file: File;
    error?: string;
    name: string;
    size: number;
    batchId: string;
    loaded: number;
}

export type State = {
    images: UploadedImage[],
    uploadImages: (images: { id: Id, blogId: number, file: File, name: string, size: number }[]) => void,
    updateImage: (originId: Id) => (changes: Partial<UploadedImage>) => void
}

export const useUploadedImages = create<State>(set => ({
    images: [],
    uploadImages: (images) => set(state => {
        const batchId = v4();
        const newImages = union(state.images, images.map(i => ({
            ...i,
            id: undefined,
            url: undefined,
            originId: `${i.id}${i.blogId}${batchId}`,
            error: undefined,
            current: false,
            processed: false,
            processing: false,
            progress: 0,
            loaded: 0,
            batchId
        })));
        return { images: distinctBy(newImages, x => x.originId) }
    }),
    updateImage: (id) => (changes) => set(state => {
        const image = state.images.find(x => x.originId === id);
        if (!image) return state;
        return ({
            images: replace(
                state.images,
                image,
                { ...image, ...changes },
                x => x.originId)
        });
    })
}));