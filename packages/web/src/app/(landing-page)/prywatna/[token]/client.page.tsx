'use client';

import { type Photo, PhotoGallery } from "~/components/gallery";
import { PageContainer } from "~/components/page-container";

export default function PrivateGalleryClientPage({ photos, likedPhotoIds }: { photos: Photo[], likedPhotoIds: string[] }) {

    const handlePhotoLike = (photo: Photo, isLiked: boolean) => {
        console.log(`Photo ${photo.id} is now ${isLiked ? 'liked' : 'unliked'}`);
    };

    return (
        <PageContainer>
            <header className="mb-12 text-center">
                <h1 className="mb-4 font-serif text-4xl font-light tracking-wide text-stone-800 md:text-5xl lg:text-6xl">
                    Galeria Zdjęć
                </h1>
                <p className="mx-auto max-w-2xl text-xl font-light italic tracking-wide text-stone-600">
                    Wybrane fotografie z różnych sesji i wydarzeń
                </p>
            </header>

            {photos.length === 0 ? (
                <div className="py-12 text-center">
                    <p className="text-lg text-stone-600">
                        Galeria jest obecnie pusta. Wróć wkrótce, aby zobaczyć nowe zdjęcia.
                    </p>
                </div>
            ) : (
                <PhotoGallery allowDownload={true} photos={photos} onPhotoLike={handlePhotoLike} likedPhotoIds={likedPhotoIds} />
            )}
        </PageContainer>)
}