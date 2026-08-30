export type GalleryManifestPhoto = {
    id: string;
    title: string;
    slideUrl: string;
    thumbnailUrl: string;
    downloadUrl: string;
    width: number;
    height: number;
    thumbnailWidth: number;
    thumbnailHeight: number;
};

type ManifestPhoto = {
    id: string;
    title: string;
    slide: string;
    thumbnail: string;
    download: string;
    width: number;
    height: number;
    thumbnailWidth: number;
    thumbnailHeight: number;
};

type GalleryManifest = {
    schemaVersion: 1;
    albums: Array<{
        photos: ManifestPhoto[];
    }>;
};

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.length > 0;

const isPositiveNumber = (value: unknown): value is number =>
    typeof value === 'number' && Number.isFinite(value) && value > 0;

const isManifestPhoto = (value: unknown): value is ManifestPhoto => {
    if (!value || typeof value !== 'object') return false;

    const photo = value as Record<string, unknown>;

    return (
        isNonEmptyString(photo.id) &&
        typeof photo.title === 'string' &&
        isNonEmptyString(photo.slide) &&
        isNonEmptyString(photo.thumbnail) &&
        isNonEmptyString(photo.download) &&
        isPositiveNumber(photo.width) &&
        isPositiveNumber(photo.height) &&
        isPositiveNumber(photo.thumbnailWidth) &&
        isPositiveNumber(photo.thumbnailHeight)
    );
};

const isGalleryManifest = (value: unknown): value is GalleryManifest => {
    if (!value || typeof value !== 'object') return false;

    const manifest = value as Record<string, unknown>;

    return (
        manifest.schemaVersion === 1 &&
        Array.isArray(manifest.albums) &&
        manifest.albums.every((album) => {
            if (!album || typeof album !== 'object') return false;
            const photos = (album as Record<string, unknown>).photos;
            return Array.isArray(photos) && photos.every(isManifestPhoto);
        })
    );
};

const getGalleryRootUrl = (rootUrl: string) => new URL(rootUrl.endsWith('/') ? rootUrl : `${rootUrl}/`);

export const fetchGalleryManifestPhotos = async (rootUrl: string): Promise<GalleryManifestPhoto[]> => {
    const galleryRootUrl = getGalleryRootUrl(rootUrl);
    const manifestUrl = new URL('gallery.json', galleryRootUrl);
    const response = await fetch(manifestUrl);

    if (!response.ok) {
        throw new Error(`Failed to fetch gallery manifest: ${response.status} ${response.statusText}`);
    }

    const manifest: unknown = await response.json();

    if (!isGalleryManifest(manifest)) {
        throw new Error('Unsupported or invalid gallery manifest');
    }

    return manifest.albums.flatMap((album) =>
        album.photos.map((photo) => ({
            id: photo.id,
            title: photo.title,
            slideUrl: new URL(photo.slide, galleryRootUrl).toString(),
            thumbnailUrl: new URL(photo.thumbnail, galleryRootUrl).toString(),
            downloadUrl: new URL(photo.download, galleryRootUrl).toString(),
            width: photo.width,
            height: photo.height,
            thumbnailWidth: photo.thumbnailWidth,
            thumbnailHeight: photo.thumbnailHeight,
        })),
    );
};
