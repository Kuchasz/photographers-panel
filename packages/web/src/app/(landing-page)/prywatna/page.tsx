'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PageContainer } from "~/components/page-container";
import { strings } from "~/resources";
import { authenticate } from "./actions";

type GalleryState = {
    password: string;
    email: string;
    isLoading: boolean;
    result?: Awaited<ReturnType<typeof authenticate>>;
};

const getContent = (
    isLoading: boolean,
    result?: Awaited<ReturnType<typeof authenticate>>
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

    const handlePasswordChange = (password: string) => {
        setState(prev => ({ ...prev, password }));
    };

    const getPrivateGalleryUrl = async () => {
        if (!state.password) return;

        setState(prev => ({ ...prev, isLoading: true }));
        try {
            const result = await authenticate(state.password);

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
        <PageContainer>
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
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
                                <Link 
                                    href={`/prywatna/${state.result.gallery.id}`}
                                    className="inline-block rounded-lg bg-stone-800 px-8 py-3 text-sm font-medium text-white transition duration-200 hover:bg-stone-700"
                                >
                                    {strings.privateGallery.enterGallery}
                                </Link>
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
            </div>
        </PageContainer>
    );
}
