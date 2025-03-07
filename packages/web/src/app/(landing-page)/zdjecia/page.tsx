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
    const rawPhotos = await getPhotos();

    // Transform the data to match the expected format
    const photos: Photo[] = rawPhotos.map(photo => {
        // Ensure we have valid URLs for all sizes
        const defaultUrl = photo.url ?? '';

        return {
            id: String(photo.id),
            alt: photo.alt ?? '',
            url: defaultUrl,
            sizes: {
                thumbnail: {
                    url: photo.sizes?.thumbnail?.url ?? defaultUrl,
                    width: photo.sizes?.thumbnail?.width ?? 400,
                    height: photo.sizes?.thumbnail?.height ?? 300,
                },
                card: {
                    url: photo.sizes?.card?.url ?? defaultUrl,
                    width: photo.sizes?.card?.width ?? 768,
                    height: photo.sizes?.card?.height ?? 1024,
                },
                tablet: {
                    url: photo.sizes?.tablet?.url ?? defaultUrl,
                    width: photo.sizes?.tablet?.width ?? 1024,
                    height: photo.sizes?.tablet?.height ?? 768,
                },
            }
        };
    });

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