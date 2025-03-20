import { getPayload } from "payload";
import React from "react";
import { OFFER_SLUG } from "~/collections/collectionSlugs";
import { PageContainer } from "~/components/page-container";
import RichText from "~/components/rich-text";
import { type OfferMedia } from "~/payload-types";
import payloadConfig from "~/payload.config";


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
    const offer = await payload.findGlobal({
        slug: OFFER_SLUG,
        depth: 2, // Ensure related images are populated
    });

    // Find the wedding offer (assuming it has a specific ID or property)
    const weddingOffer = offer;

    return (
        <PageContainer>
            <section className="space-y-24">
                {/* Wedding Section */}
                <article className="space-y-12">
                    <header className="space-y-4">
                        <h1 className="font-serif text-4xl font-light tracking-wide text-stone-800 md:text-5xl lg:text-6xl">
                            {weddingOffer.title}
                        </h1>
                        <h2 className="text-xl font-light italic tracking-wide text-stone-600 md:text-2xl">
                            {weddingOffer.descShort}
                        </h2>
                    </header>

                    <article className="space-y-16">
                        {weddingOffer.photo && (
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {weddingOffer.photo.map((photo, index) => {
                                    // Handle both populated and non-populated photo references
                                    const photoData = typeof photo === 'number' ? null : photo as OfferMedia;
                                    if (!photoData?.url) return null;

                                    return (
                                        <div
                                            key={photoData.url || index}
                                            className="group aspect-[3/4] overflow-hidden rounded-lg bg-stone-100 shadow-lg transition duration-300 hover:shadow-xl"
                                            style={getImageBackgroundStyle(photoData.url)}
                                        >
                                            <div className="h-full w-full bg-stone-950/10 transition duration-300 group-hover:bg-stone-950/0" />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <RichText className="max-w-[48rem] mx-auto" data={weddingOffer.content!} enableGutter={false} />
                    </article>
                </article>
            </section>
        </PageContainer>
    );
}