import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { validateToken } from "~/collections/private-gallery/private-gallery-actions";
import { PhotoGallery } from "~/components/gallery";
import { PageContainer } from "~/components/page-container";
import { getPhotos } from "./actions";
import { type Metadata } from "next";

export const metadata: Metadata = {
    title: 'Zdjęcia | Fotografia',
    description: 'Galeria zdjęć - najlepsze ujęcia z sesji ślubnych, portretowych i innych wydarzeń.',
};

export default async function PrivateGalleryPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params;
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
    const isValid = await validateToken(token, ip);

    if (!isValid) {
        redirect('/prywatna');
    }

    const photos = await getPhotos(token);

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
                <PhotoGallery allowDownload={true} photos={photos} />
            )}
        </PageContainer>)
}