'use client';

import { type Photo, PhotoGallery } from "~/components/gallery";
import { PageContainer } from "~/components/page-container";
import { SectionTitle } from "~/components/section-title";
import { strings } from "~/resources";

type PrivateGalleryClientPageProps = {
    photos: Photo[];
    galleryTitle?: string;
};

export default function PrivateGalleryClientPage({ photos, galleryTitle = '' }: PrivateGalleryClientPageProps) {

    const handleDownload = (photo: Photo) => {
        console.log('Downloading photo:', photo);
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