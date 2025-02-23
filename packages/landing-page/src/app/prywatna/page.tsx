'use client';

import * as commonPrivateGallery from "@pp/api/dist/private-gallery";
import * as privateGallery from "@pp/api/dist/site/private-gallery";
import { ResultType } from "@pp/api/dist/common";
import { strings } from "~/resources";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

type GalleryState = {
    password: string;
    email: string;
    isLoading: boolean;
    isLoadingNotification: boolean;
    result?: privateGallery.PrivateGalleryUrlCheckResult;
    notificationResult?: privateGallery.SubscribtionResult;
};

const getContent = (
    isLoading: boolean,
    result?: privateGallery.PrivateGalleryUrlCheckResult
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

    if (result.gallery.state === commonPrivateGallery.PrivateGalleryState.Available) {
        return {
            title: strings.privateGallery.available.title.replace(':title', result.gallery.title),
            description: strings.privateGallery.available.description,
        };
    }

    if (result.gallery.state === commonPrivateGallery.PrivateGalleryState.TurnedOff) {
        return {
            title: strings.privateGallery.turnedOff.title.replace(':title', result.gallery.title),
            description: strings.privateGallery.turnedOff.description,
        };
    }

    if (result.gallery.state === commonPrivateGallery.PrivateGalleryState.NotReady) {
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
        isLoadingNotification: false,
    });

    const viewGalleryRef = useRef<HTMLFormElement>(null);

    const handlePasswordChange = (password: string) => {
        setState(prev => ({ ...prev, password }));
    };

    const handleEmailChange = (email: string) => {
        setState(prev => ({ ...prev, email }));
    };

    const getPrivateGalleryUrl = async () => {
        if (!state.password) return;

        setState(prev => ({ ...prev, isLoading: true }));
        try {
            const result = await privateGallery.getGalleryUrl(state.password);
            const passwordReset = !result.gallery;
            setState(prev => ({
                ...prev,
                result,
                isLoading: false,
                password: passwordReset ? '' : prev.password,
            }));
        } catch (error) {
            setState(prev => ({ ...prev, isLoading: false }));
            console.error('Failed to get gallery URL:', error);
        }
    };

    const subscribeForNotification = async () => {
        if (!state.result?.gallery) return;

        setState(prev => ({ ...prev, isLoadingNotification: true }));
        try {
            const result = await privateGallery.subscribeForNotification({
                privateGalleryId: state.result.gallery.id,
                email: state.email,
            });
            setState(prev => ({
                ...prev,
                notificationResult: result,
                isLoadingNotification: false,
            }));
        } catch (error) {
            setState(prev => ({ ...prev, isLoadingNotification: false }));
            console.error('Failed to subscribe for notification:', error);
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

                        {state.result?.gallery?.state === commonPrivateGallery.PrivateGalleryState.NotReady && (
                            <div className="space-y-6 rounded-lg border border-stone-200 bg-white p-6">
                                {state.isLoadingNotification && (
                                    <div className="text-stone-600">{strings.privateGallery.notification.subscribing}</div>
                                )}
                                {state.notificationResult?.type === ResultType.Success && (
                                    <div className="text-green-600">{strings.privateGallery.notification.subscribedSuccessfully}</div>
                                )}
                                {state.notificationResult?.type === ResultType.Error && (
                                    <div className="text-red-600">
                                        {strings.privateGallery.notification.errors[state.notificationResult.error]}
                                    </div>
                                )}
                                <div className="space-y-4">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder={strings.privateGallery.notification.email}
                                        onChange={(e) => handleEmailChange(e.target.value)}
                                        value={state.email}
                                        className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-stone-800 outline-none transition duration-200 placeholder:text-stone-400 focus:border-stone-400"
                                        required
                                    />
                                    <button
                                        onClick={subscribeForNotification}
                                        disabled={state.isLoadingNotification}
                                        className="inline-block rounded-lg bg-stone-800 px-8 py-3 text-sm font-medium text-white transition duration-200 hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {strings.privateGallery.notification.subscribe}
                                    </button>
                                </div>
                            </div>
                        )}

                        {state.result?.gallery && (
                            <div className="space-y-6">
                                {state.result.gallery.state === commonPrivateGallery.PrivateGalleryState.Available ? (
                                    <>
                                        <form
                                            ref={viewGalleryRef}
                                            method="POST"
                                            action={privateGallery.viewGallery.route}
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
                                ) : state.result.blog ? (
                                    <div className="space-y-4">
                                        <p className="text-stone-600">
                                            {strings.privateGallery.blogAvailable.replace(':title', state.result.blog.title)}
                                        </p>
                                        <Link
                                            href={`/blog/${state.result.blog.alias}`}
                                            className="inline-block rounded-lg bg-stone-800 px-8 py-3 text-sm font-medium text-white transition duration-200 hover:bg-stone-700"
                                        >
                                            {strings.privateGallery.enterBlog}
                                        </Link>
                                    </div>
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
