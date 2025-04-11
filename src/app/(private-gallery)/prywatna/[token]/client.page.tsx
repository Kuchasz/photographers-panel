'use client';

import { type Photo, PhotoGallery } from "~/components/gallery";
import { SectionTitle } from "~/components/section-title";
import { strings } from "~/resources";
import { downloadImageByUrl } from "~/lib/file";
import { useParams } from "next/navigation";
import { registerPhotoDownload } from "./actions";

type PrivateGalleryClientPageProps = {
    photos: Photo[];
    galleryTitle?: string;
    photo: Photo;
};

export default function PrivateGalleryClientPage({ photos, galleryTitle = '', photo }: PrivateGalleryClientPageProps) {
    const { token } = useParams<{ token: string }>();

    const handleDownload = async (photo: Photo) => {
        try {
            const imageUrl = photo.sizes?.big?.url || photo.url;
            await downloadImageByUrl(imageUrl);
            await registerPhotoDownload(token as string, photo.id);
        } catch (error) {
            console.error('Error during photo download:', error);
        }
    };

    const displayTitle = galleryTitle || strings.privateGallery.title;

    return (
        <div className="container mx-auto px-4">
            <div className="relative w-full h-[60vh] mb-2">
                <img
                    src={photo.sizes?.big?.url || photo.url}
                    alt={photo.alt || ''}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                    <SectionTitle
                        title={displayTitle}
                        subtitle={strings.pageTitles.private}
                        className="[&_p]:text-white/90 [&_h2]:text-white"
                    />
                </div>
            </div>

            {photos.length === 0 ? (
                <div className="py-12 text-center">
                    <p className="text-lg text-stone-600">
                        {strings.privateGallery.unavailable}
                    </p>
                </div>
            ) : (
                <PhotoGallery photos={photos} onPhotoDownload={handleDownload} />
            )}
        </div>
    );
} 