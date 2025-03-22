'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PageContainer } from "~/components/page-container";
import { Label } from "~/components/form";
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
            <div className="max-w-7xl mx-auto">
                <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
                    {/* Content Section */}
                    <div className="space-y-8">
                        <div className="space-y-5">
                            <h1 className="font-serif text-4xl font-light tracking-wide text-stone-800 md:text-5xl lg:text-6xl">
                                {content.title}
                            </h1>
                            <h2 className="text-xl font-light text-stone-600 leading-relaxed">
                                {content.description}
                            </h2>
                        </div>

                        {/* Authentication Card */}
                        {(!state.result?.gallery) && (
                            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="password" required>
                                            {strings.privateGallery.password}
                                        </Label>
                                        <input
                                            id="password"
                                            type="password"
                                            name="password"
                                            placeholder={strings.privateGallery.password}
                                            onChange={(e) => handlePasswordChange(e.target.value)}
                                            value={state.password}
                                            className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-stone-800 
                                                outline-none transition duration-200 placeholder:text-stone-400 
                                                hover:border-stone-300 focus:border-stone-400 focus:ring-1 focus:ring-stone-300"
                                            required
                                        />
                                    </div>
                                    
                                    <button
                                        onClick={getPrivateGalleryUrl}
                                        disabled={state.isLoading || !state.password}
                                        className="w-full rounded-lg bg-stone-800 px-8 py-3 text-sm font-medium text-white 
                                            transition duration-200 hover:bg-stone-700 
                                            disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-stone-500"
                                    >
                                        {state.isLoading ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sprawdzanie...
                                            </span>
                                        ) : (
                                            strings.privateGallery.check
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Success Card */}
                        {state.result?.gallery && (
                            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
                                <div className="space-y-6">
                                    {state.result.gallery.state === 'published' ? (
                                        <>
                                            <div className="rounded-lg border border-green-100 bg-green-50 p-4 text-green-800">
                                                <p className="text-sm">
                                                    Znaleziono galerię! Dziękujemy za wprowadzenie prawidłowego hasła.
                                                </p>
                                            </div>
                                            <Link
                                                href={`/prywatna/${state.result.gallery.token}`}
                                                className="inline-block w-full rounded-lg bg-stone-800 px-8 py-3 text-center text-sm font-medium text-white 
                                                    transition duration-200 hover:bg-stone-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                                            >
                                                {strings.privateGallery.enterGallery}
                                            </Link>
                                        </>
                                    ) : (
                                        <div className="rounded-lg border border-yellow-100 bg-yellow-50 p-4 text-yellow-800">
                                            <p className="text-sm">
                                                Galeria nie jest obecnie dostępna.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Image Section */}
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100 shadow-lg md:aspect-auto md:h-[480px]">
                        <Image
                            src='/images/page_private_photo.png'
                            alt="Private Gallery"
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
