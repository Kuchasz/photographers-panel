import { type Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { validateToken } from "~/collections/private-gallery/private-gallery-actions";
import { getPhotos, getGalleryHero } from "./actions";
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
        redirect('/strefa-klienta');
    }

    const { title, date, photo } = await getGalleryHero(token);

    return (
        <PrivateGalleryClientPage
            photo={photo}
            galleryTitle={title}
            galleryDate={date}
        />
    )
}