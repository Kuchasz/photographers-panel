'use client';

import { routes } from "@pp/api/dist/site/routes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { tsr } from "~/api";
import { strings } from "~/resources";
import { getPayload } from "payload";
import payloadConfig from "~/payload.config";

const getOfferUrl = (alias: string) => routes.offer.route.replace(':alias', alias);

const getImageBackgroundStyle = (url: string): React.CSSProperties => ({
    backgroundImage: `url(${url})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
});

export default async function OffersPage() {
    const payload = await getPayload({
        config: payloadConfig,
    });

    // Fetch offers from PayloadCMS
    const { docs: offers } = await payload.find({
        collection: 'offers',
        sort: ['order'],
    });

    // Find the wedding offer (assuming it has a specific ID or property)
    const weddingOffer = offers.find(offer => offer.isWedding) || offers[0];
    
    // Filter other offers
    const otherOffers = offers.filter(offer => offer !== weddingOffer);

    if (!offers.length) {
        return <div>No offers found</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
            <main className="container mx-auto px-4 py-16 md:py-24">
                <section className="mx-auto max-w-7xl space-y-24">
                    {/* Wedding Section */}
                    <article className="space-y-12">
                        <header className="space-y-4">
                            <h1 className="font-serif text-4xl font-light tracking-wide text-stone-800 md:text-5xl lg:text-6xl">
                                {strings.offer.wedding.title}
                            </h1>
                            <h2 className="text-xl font-light italic tracking-wide text-stone-600 md:text-2xl">
                                {strings.offer.wedding.description}
                            </h2>
                        </header>

                        <article className="space-y-16">
                            {weddingOffer.photos && weddingOffer.photos.length > 0 && (
                                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                    {weddingOffer.photos.map((photo) => (
                                        <div
                                            key={photo.url}
                                            className="group aspect-[3/4] overflow-hidden rounded-lg bg-stone-100 shadow-lg transition duration-300 hover:shadow-xl"
                                            style={getImageBackgroundStyle(photo.url)}
                                        >
                                            <div className="h-full w-full bg-stone-950/10 transition duration-300 group-hover:bg-stone-950/0" />
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div
                                className="prose prose-lg mx-auto max-w-none prose-headings:font-serif prose-headings:font-light prose-headings:text-stone-800 prose-p:font-light prose-p:leading-relaxed prose-p:text-stone-600"
                                dangerouslySetInnerHTML={{ __html: weddingOffer.description }}
                            />
                        </article>
                    </article>

                    {/* Other Offers Section */}
                    <article className="space-y-12">
                        <header className="space-y-4 text-center">
                            <h1 className="font-serif text-4xl font-light tracking-wide text-stone-800 md:text-5xl">
                                {strings.offer.other.title}
                            </h1>
                            <h2 className="mx-auto max-w-2xl text-xl font-light italic tracking-wide text-stone-600">
                                {strings.offer.other.description}
                            </h2>
                        </header>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {otherOffers.map((offer) => (
                                <Link
                                    href={getOfferUrl(offer.alias)}
                                    key={offer.alias}
                                    className="group overflow-hidden rounded-lg bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className="aspect-[3/2] relative">
                                        <Image
                                            src={offer.photoUrl}
                                            alt={offer.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/0 to-stone-950/20 transition duration-300 group-hover:to-stone-950/10" />
                                    </div>
                                    <div className="space-y-3 p-6">
                                        <h3 className="font-serif text-xl font-light text-stone-800 group-hover:text-stone-900">
                                            {offer.title}
                                        </h3>
                                        <p className="font-light leading-relaxed text-stone-600">
                                            {offer.summary}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </article>
                </section>
            </main>
        </div>
    );
}