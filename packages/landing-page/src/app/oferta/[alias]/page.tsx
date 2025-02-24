'use client';

import Image from "next/image";
import React, { use } from "react";
import { tsr } from "~/api";
import { Headers } from "~/components/headers";

type OfferProps = {
    params: Promise<{
        alias: string;
    }>;
};

export default function OfferPage({ params }: OfferProps) {

    const { alias } = use(params);
    const { data, isLoading } = tsr.offer.getOffer.useQuery({ queryKey: ['offer'], queryData: { query: { alias } } });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (data?.status !== 200) {
        return <div>Error</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
            <Headers title={data.body.title} />

            <main className="container mx-auto px-4 py-16 md:py-24">
                <article className="mx-auto max-w-5xl">
                    <header className="mb-16 space-y-6 text-center">
                        <h1 className="font-serif text-4xl font-light tracking-wide text-stone-800 md:text-5xl lg:text-6xl">
                            {data.body.title}
                        </h1>
                        {data.body.summary && (
                            <h2 className="mx-auto max-w-2xl text-xl font-light italic tracking-wide text-stone-600 md:text-2xl">
                                {data.body.summary}
                            </h2>
                        )}
                    </header>

                    {data.body.photos?.length > 0 && (
                        <div className="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {data.body.photos.map((photo) => (
                                <div
                                    key={photo.url}
                                    className="group aspect-[3/4] overflow-hidden rounded-lg bg-stone-100 shadow-lg transition duration-300 hover:shadow-xl"
                                >
                                    <div className="relative h-full w-full">
                                        <Image
                                            src={photo.url}
                                            alt={data.body.title}
                                            fill
                                            className="object-cover transition duration-300 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/0 to-stone-950/20 transition duration-300 group-hover:to-stone-950/10" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div
                        className="prose prose-lg mx-auto max-w-3xl prose-headings:font-serif prose-headings:font-light prose-headings:text-stone-800 prose-p:font-light prose-p:leading-relaxed prose-p:text-stone-600 prose-a:text-stone-800 prose-a:underline-offset-4 hover:prose-a:text-stone-600"
                        dangerouslySetInnerHTML={{ __html: data.body.description }}
                    />
                </article>
            </main>
        </div>
    );
}
