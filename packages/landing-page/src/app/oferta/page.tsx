'use client';

import React from "react";
import { getOffer, type OfferEntry } from "@pp/api/dist/site/offer";
import { Headers } from "~/components/headers";

const getImageBackgroundStyle = (url: string): React.CSSProperties => ({
    backgroundImage: `url(${url})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
});

type OfferProps = {
    alias: string;
    initialState: OfferEntry;
};

export default function OfferPage({ alias, initialState }: OfferProps) {
    const [offer, setOffer] = React.useState<OfferEntry>(initialState ?? {});

    React.useEffect(() => {
        void getOffer(alias).then(setOffer);
    }, [alias]);

    return (
        <div className="min-h-screen bg-white">
            <Headers title={offer.title} />
            
            <main className="container mx-auto px-4 py-16 md:py-24">
                <article className="mx-auto max-w-4xl">
                    <h1 className="mb-12 font-serif text-4xl font-light tracking-wide text-stone-800 md:text-5xl lg:text-6xl">
                        {offer.title}
                    </h1>

                    {offer.photos?.length > 0 && (
                        <div className="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {offer.photos.map((photo) => (
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
                        className="prose prose-lg mx-auto max-w-none prose-headings:font-serif prose-headings:font-light prose-headings:text-stone-800 prose-p:font-light prose-p:text-stone-600 prose-a:text-rose-600 prose-a:no-underline hover:prose-a:text-rose-500"
                        dangerouslySetInnerHTML={{ __html: offer.description }}
                    />
                </article>
            </main>
        </div>
    );
}
