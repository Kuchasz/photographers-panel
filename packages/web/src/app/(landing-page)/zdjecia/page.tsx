import { type Metadata } from 'next';
import { PageContainer } from '~/components/page-container';
import { getPhotos } from './actions';
import { PhotoGallery } from './photo-gallery.client';
import { type Photo } from './photo-tile';

export const metadata: Metadata = {
    title: 'Zdjęcia | Fotografia',
    description: 'Galeria zdjęć - najlepsze ujęcia z sesji ślubnych, portretowych i innych wydarzeń.',
};

export default async function PhotosPage() {
    const photos = await getPhotos();

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
                <PhotoGallery photos={photos} />
            )}
        </PageContainer>
    );
} 