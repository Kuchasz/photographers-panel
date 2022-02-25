import create from "zustand";
import { distinctBy, replace, union } from "@pp/utils/dist/array";
import { getBlogAssets } from "@pp/api/dist/panel/blog";
import { v4 } from "@pp/utils/dist/uuid";

type Id = string;

type ActiveStatus = 'uploading' | 'processing';
type QueuedStatus = 'queued';
type EndedStatus = 'successful' | 'failed';
type Status = QueuedStatus | ActiveStatus | EndedStatus;

export const isProcessed = (status: Status): status is EndedStatus => status === 'successful' || status === 'failed';
export const isQueued = (status: Status): status is QueuedStatus => status === 'queued';
export const isActive = (status: Status): status is ActiveStatus => status === 'uploading' || status === 'processing';

export type UploadedImage = {
    blogId: number;

    originId: Id;
    file: File;
    name: string;
    status: Status;
    batchId: string;
    progress: number;
    size: number;
    loaded: number;
    lastBytesPerSecond: number;
};

export interface BlogAsset {
    id: number;
    blogId: number;
    url: string;
    isMain: boolean;
    alt: string;
}

export type State = {
    images: UploadedImage[];
    assets: BlogAsset[];
    imagesFetchedForBlogs: number[];
    uploadImages: (images: { id: Id; blogId: number; file: File; name: string; size: number }[]) => void;
    updateImage: (originId: Id) => (changes: Partial<UploadedImage>) => void;
    fetchAssets: (blogId: number) => void;
    updateAsset: (assetId: number) => (changes: Partial<BlogAsset>) => void;
    deleteAsset: (assetId: number) => void;
    finalizeUpload: (originId: Id, changes: Partial<UploadedImage>, asset: BlogAsset) => void;
};

export const useUploadedImages = create<State>((set, get) => ({
    images: [],
    assets: [],
    imagesFetchedForBlogs: [],
    uploadImages: (images) =>
        set((state) => {
            const batchId = v4();
            const newImages = union(
                state.images,
                images.map((i) => ({
                    ...i,
                    id: undefined,
                    url: undefined,
                    originId: v4(),
                    status: 'queued' as Status,
                    progress: 0,
                    lastBytesPerSecond: 0,
                    loaded: 0,
                    batchId,
                }))
            );
            return { images: distinctBy(newImages, (x) => x.originId) };
        }),
    updateImage: (id) => (changes) =>
        set((state) => {
            const image = state.images.find((x) => x.originId === id);
            if (!image) return { images: state.images };
            return {
                images: replace(state.images, image, { ...image, ...changes }, (x) => x.originId),
            };
        }),
    fetchAssets: async (blogId) => {
        const state = get();
        if (state.imagesFetchedForBlogs.includes(blogId)) return;

        const fetchedAssets = await getBlogAssets(blogId);
        const assets = fetchedAssets.map((a) => ({ ...a, blogId }));
        set({
            imagesFetchedForBlogs: [...state.imagesFetchedForBlogs, blogId],
            assets: [...state.assets, ...assets],
        });
    },
    updateAsset: (id) => (changes) =>
        set((state) => {
            const asset = state.assets.find((x) => x.id === id);
            if (!asset) return { assets: state.assets };
            return {
                assets: replace(state.assets, asset, { ...asset, ...changes }, (x) => x.id),
            };
        }),
    deleteAsset: (id) =>
        set((state) => ({
            assets: state.assets.filter((a) => a.id !== id),
        })),
    finalizeUpload: (originId, changes, asset) =>
        set((state) => {
            const image = state.images.find((x) => x.originId === originId);
            if (!image) return { images: state.images, assets: state.assets };
            return {
                images: replace(state.images, image, { ...image, ...changes }, (x) => x.originId),
                assets: [...state.assets, asset],
            };
        }),
}));
