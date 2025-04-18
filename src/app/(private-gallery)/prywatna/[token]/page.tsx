import { type Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { validateToken } from "~/collections/private-gallery/private-gallery-actions";
import { getPhotos, getGalleryTitle } from "./actions";
import PrivateGalleryClientPage from "./client.page";

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

    if (!photos) {
        redirect('/prywatna');
    }

    const { title, date } = await getGalleryTitle(token);

    return (
        <PrivateGalleryClientPage
            photo={photos.photo}
            photos={photos.photos}
            galleryTitle={title}
            galleryDate={date}
        />
    )
}