'use client';
import Image from "next/image";
import Link from "next/link";
import { PageContainer } from "~/components/page-container";
import { FormLabel } from "~/components/form";
import { FormButton } from "~/components/form/button";
import { strings } from "~/resources";
import { authenticate } from "./actions";
import { useActionState } from "react";

export default function PrivateGallery() {
    const [state, formAction] = useActionState(authenticate, {
        password: '',
        authenticated: false,
        isDirty: false
    });

    return (
        <PageContainer>
            <div className="max-w-7xl mx-auto">
                <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
                    {/* Content Section */}
                    <div className="space-y-8">
                        <div className="space-y-5">
                            <h1 className="font-serif text-4xl font-light tracking-wide text-stone-800 md:text-5xl lg:text-6xl">
                                {strings.privateGallery.title}
                            </h1>
                            <h2 className="text-xl font-light text-stone-600 leading-relaxed">
                                {strings.privateGallery.description}
                            </h2>
                        </div>

                        {/* Authentication Card */}
                        {(!state?.authenticated) && (
                            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
                                <form action={formAction} className="space-y-6">
                                    <div className="space-y-2">
                                        <FormLabel htmlFor="password" required>
                                            {strings.privateGallery.password}
                                        </FormLabel>
                                        <input
                                            id="password"
                                            type="password"
                                            name="password"
                                            className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-stone-800 
                                                outline-none transition duration-200 placeholder:text-stone-400 
                                                hover:border-stone-300 focus:border-stone-400 focus:ring-1 focus:ring-stone-300"
                                            required
                                        />
                                    </div>

                                    <FormButton>
                                        {strings.privateGallery.check}
                                    </FormButton>
                                </form>
                                
                                {/* Error message for failed authentication attempts */}
                                {state.isDirty && !state.authenticated && (
                                    <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-4 text-red-800">
                                        <p className="text-sm">
                                            {strings.privateGallery.notExists.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Success Card */}
                        {state?.authenticated && state.galleryData && (
                            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
                                <div className="space-y-6">
                                    {state.galleryData.state === 'published' ? (
                                        <>
                                            <div className="rounded-lg border border-green-100 bg-green-50 p-4 text-green-800">
                                                <p className="text-sm" dangerouslySetInnerHTML={{
                                                    __html: strings.privateGallery.galleryFound.replace('{title}', state.galleryData.title)
                                                }} />
                                            </div>
                                            <Link
                                                href={`/prywatna/${state.token}`}
                                                className="inline-block w-full rounded-lg bg-stone-800 px-8 py-3 text-center text-sm font-medium text-white 
                                                    transition duration-200 hover:bg-stone-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                                            >
                                                {strings.privateGallery.enterGallery}
                                            </Link>
                                        </>
                                    ) : state.galleryData.state === 'archived' ? (
                                        <div className="rounded-lg border border-yellow-100 bg-yellow-50 p-4 text-yellow-800">
                                            <p className="text-sm">
                                                {strings.privateGallery.turnedOff.description}
                                            </p>
                                        </div>
                                    ) : state.galleryData.state === 'draft' ? (
                                        <div className="rounded-lg border border-yellow-100 bg-yellow-50 p-4 text-yellow-800">
                                            <p className="text-sm">
                                                {strings.privateGallery.notReady.description}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border border-yellow-100 bg-yellow-50 p-4 text-yellow-800">
                                            <p className="text-sm">
                                                {strings.privateGallery.unavailable}
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
                            alt={strings.privateGallery.imageAlt}
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
