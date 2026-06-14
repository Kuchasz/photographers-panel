export const privateGalleryLoginStatuses = [
    'not-found',
    'draft',
    'archived',
    'session-expired',
    'error',
] as const;

export type PrivateGalleryLoginStatus = typeof privateGalleryLoginStatuses[number];

export const isPrivateGalleryLoginStatus = (value: unknown): value is PrivateGalleryLoginStatus => {
    return typeof value === 'string' && privateGalleryLoginStatuses.includes(value as PrivateGalleryLoginStatus);
};

export const getPrivateGalleryLoginPath = (status: PrivateGalleryLoginStatus) => {
    return `/strefa-klienta?status=${status}`;
};
