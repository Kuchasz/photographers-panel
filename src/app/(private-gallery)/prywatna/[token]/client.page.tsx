'use client';

import { type Photo, PhotoGallery } from "~/components/gallery";
import { SectionTitle } from "~/components/section-title";
import { strings } from "~/resources";
import { useParams } from "next/navigation";
import { downloadPhotoWithCors } from "./actions";
import { saveBlobAsDownload } from "~/lib/file";

const styles = `
@keyframes photoZoom {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes titleZoom {
  0% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}

.animate-photo-zoom {
  animation: photoZoom 20s ease-in-out infinite;
}

.animate-title-zoom {
  animation: titleZoom 20s ease-in-out infinite;
}
`;

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
            // Call the server action to proxy the image with CORS and register the download
            const result = await downloadPhotoWithCors(imageUrl, token);
            if (result.error) throw new Error(result.error);
            if (!result.blob || !result.filename) throw new Error('Missing blob or filename');
            saveBlobAsDownload(result.blob, result.filename);
        } catch (error) {
            console.error('Error during photo download:', error);
        }
    };

    const displayTitle = galleryTitle || strings.privateGallery.title;

    return (
        <>
            <style jsx>{styles}</style>
            <div className="container mx-auto px-4">
                <div className="relative w-full h-[60vh] mb-2 overflow-hidden rounded-lg">
                    <img
                        src={photo.sizes?.big?.url || photo.url}
                        alt={photo.alt || ''}
                        className="w-full h-full object-cover animate-photo-zoom rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/40">
                        <div className="absolute top-[66%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4">
                            <div className="animate-title-zoom">
                                <SectionTitle
                                    title={displayTitle}
                                    subtitle={strings.pageTitles.private}
                                    className="[&_p]:text-white/90 [&_h2]:text-white"
                                />
                            </div>
                        </div>
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
        </>
    );
} 