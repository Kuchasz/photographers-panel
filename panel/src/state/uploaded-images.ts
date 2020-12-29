import { distinctBy, replace, union } from "@pp/utils/array";
import { v4 } from "@pp/utils/uuid";
import create from "zustand";

type Id = string;

type ActiveStatus = "uploading" | "processing";
type QueuedStatus = "queued";
type EndedStatus = "successful" | "failed";
type Status = QueuedStatus | ActiveStatus | EndedStatus;

export const isProcessed = (status: Status): status is EndedStatus => status === "successful" || status === "failed";
export const isQueued = (status: Status): status is QueuedStatus => status === "queued";
export const isActive = (status: Status): status is ActiveStatus => status === "uploading" || status === "processing";

export type UploadedImage = {
    originId: Id;
    blogId: number;
    file: File;
    name: string;

    id?: number;
    url?: string;
    
    status: Status;
    // processed: boolean;
    // current: boolean;
    // processing: boolean;

    // error?: string;
    batchId: string;

    progress: number;
    size: number;
    loaded: number;
    lastBytesPerSecond: number;
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
            originId: v4(),
            status: "queued" as Status,
            progress: 0,
            lastBytesPerSecond: 0,
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