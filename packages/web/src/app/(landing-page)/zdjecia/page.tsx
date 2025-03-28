import { type Metadata } from 'next';
import { PageContainer } from '~/components/page-container';
import { SectionTitle } from '~/components/section-title';
import { getPhotos } from './actions';
import { PhotoGallery } from '~/components/gallery';

export const metadata: Metadata = {
    title: 'Zdjęcia | Fotografia',
    description: 'Galeria zdjęć - najlepsze ujęcia z sesji ślubnych, portretowych i innych wydarzeń.',
};

export default async function PhotosPage() {
    const photos = await getPhotos();

    return (
        <PageContainer>
            <header>
                <SectionTitle
                    title="Galeria Zdjęć"
                    subtitle="Wybrane fotografie z różnych sesji i wydarzeń"
                />
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