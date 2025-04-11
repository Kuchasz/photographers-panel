'use client';

import { type Photo, PhotoGallery } from "~/components/gallery";
import { PageContainer } from "~/components/page-container";
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
            // Download the photo using the utility from utils package
            const imageUrl = photo.sizes?.big?.url || photo.url;
            await downloadImageByUrl(imageUrl);
            
            // After successful download, record it using the server action
            await registerPhotoDownload(token as string, photo.id);
        } catch (error) {
            console.error('Error during photo download:', error);
        }
    };

    // Use the gallery title if available, otherwise use the default title
    const displayTitle = galleryTitle || strings.privateGallery.title;

    return (
        <PageContainer>
            <header>
                <SectionTitle
                    title={displayTitle}
                    subtitle={strings.pageTitles.private}
                />
            </header>

            {photos.length === 0 ? (
                <div className="py-12 text-center">
                    <p className="text-lg text-stone-600">
                        {strings.privateGallery.unavailable}
                    </p>
                </div>
            ) : (
                <PhotoGallery photos={photos} onPhotoDownload={handleDownload} />
            )}
        </PageContainer>
    )
}