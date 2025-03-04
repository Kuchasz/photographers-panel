'use client';

import Image from "next/image";
import { useRef, useState } from "react";
import { strings } from "~/resources";
import { checkGalleryPassword } from "./actions";

type GalleryState = {
    password: string;
    email: string;
    isLoading: boolean;
    result?: Awaited<ReturnType<typeof checkGalleryPassword>>;
};

const getContent = (
    isLoading: boolean,
    result?: Awaited<ReturnType<typeof checkGalleryPassword>>
): { title: string; description: string } => {
    if (isLoading || !result) {
        return {
            title: strings.privateGallery.title,
            description: strings.privateGallery.description,
        };
    }

    if (!result.gallery) {
        return {
            title: strings.privateGallery.notExists.title,
            description: strings.privateGallery.notExists.description,
        };
    }

    if (result.gallery.state === 'published') {
        return {
            title: strings.privateGallery.available.title.replace(':title', result.gallery.title),
            description: strings.privateGallery.available.description,
        };
    }

    if (result.gallery.state === 'archived') {
        return {
            title: strings.privateGallery.turnedOff.title.replace(':title', result.gallery.title),
            description: strings.privateGallery.turnedOff.description,
        };
    }

    if (result.gallery.state === 'draft') {
        return {
            title: strings.privateGallery.notReady.title.replace(':title', result.gallery.title),
            description: strings.privateGallery.notReady.description,
        };
    }

    throw new Error('Not handled content!');
};

export default function PrivateGallery() {
    const [state, setState] = useState<GalleryState>({
        password: '',
        email: '',
        isLoading: false,
    });

    const viewGalleryRef = useRef<HTMLFormElement>(null);

    const handlePasswordChange = (password: string) => {
        setState(prev => ({ ...prev, password }));
    };

    const getPrivateGalleryUrl = async () => {
        if (!state.password) return;

        setState(prev => ({ ...prev, isLoading: true }));
        try {
            const result = await checkGalleryPassword(state.password);

            const passwordReset = !result.gallery;
            setState(prev => ({
                ...prev,
                result: result,
                isLoading: false,
                password: passwordReset ? '' : prev.password,
            }));
        } catch (error) {
            setState(prev => ({ ...prev, isLoading: false }));
            console.error('Failed to get gallery URL:', error);
        }
    };

    const content = getContent(state.isLoading, state.result);

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white py-16">
            <div className="container mx-auto px-4">
                <section className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-between">
                    <article className="w-full max-w-2xl space-y-8">
                        <div className="space-y-4">
                            <h1 className="font-serif text-4xl font-light tracking-wide text-stone-800">{content.title}</h1>
                            <h2 className="text-lg font-light leading-relaxed text-stone-600">{content.description}</h2>
                        </div>

                        {(!state.result?.gallery) && (
                            <div className="space-y-4">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder={strings.privateGallery.password}
                                    onChange={(e) => handlePasswordChange(e.target.value)}
                                    value={state.password}
                                    className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-stone-800 outline-none transition duration-200 placeholder:text-stone-400 focus:border-stone-400"
                                    required
                                />
                                <button
                                    onClick={getPrivateGalleryUrl}
                                    disabled={state.isLoading}
                                    className="inline-block rounded-lg bg-stone-800 px-8 py-3 text-sm font-medium text-white transition duration-200 hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {strings.privateGallery.check}
                                </button>
                            </div>
                        )}

                        {state.result?.gallery && (
                            <div className="space-y-6">
                                {state.result.gallery.state === 'published' ? (
                                    <>
                                        <form
                                            ref={viewGalleryRef}
                                            method="POST"
                                            action={'/gallery'}
                                            className="hidden"
                                        >
                                            <input type="hidden" name="galleryId" value={state.result.gallery.id} />
                                            <input type="hidden" name="galleryUrl" value={state.result.gallery.url} />
                                        </form>
                                        <button
                                            onClick={() => viewGalleryRef.current?.submit()}
                                            className="inline-block rounded-lg bg-stone-800 px-8 py-3 text-sm font-medium text-white transition duration-200 hover:bg-stone-700"
                                        >
                                            {strings.privateGallery.enterGallery}
                                        </button>
                                    </>
                                ) : null}
                            </div>
                        )}
                    </article>

                    <div className="w-full max-w-xl">
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                            <Image
                                src='/images/page_private_photo.png'
                                alt=""
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority
                            />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
