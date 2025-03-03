import config from "@payload-config";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import { Headers } from "~/components/headers";
import RichText from "~/components/rich-text";

type OfferProps = {
    params: Promise<{
        alias: string;
    }>;
};

export default async function OfferPage({ params }: OfferProps) {
    const { alias } = await params;

    // Initialize PayloadCMS client
    const payloadConfig = await config;
    const payload = await getPayload({ config: payloadConfig });

    // Fetch offer data from PayloadCMS
    const offerResponse = await payload.find({
        collection: 'offers',
        where: {
            alias: {
                equals: alias,
            },
        },
        depth: 2, // To populate related media
    });

    // Handle not found or error cases
    if (!offerResponse.docs || offerResponse.docs.length === 0) {
        notFound();
    }

    const offer = offerResponse.docs[0]!;

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
            <Headers title={offer.title} />

            <main className="container mx-auto px-4 py-16 md:py-24">
                <article className="mx-auto max-w-5xl">
                    <header className="mb-16 space-y-6 text-center">
                        <h1 className="font-serif text-4xl font-light tracking-wide text-stone-800 md:text-5xl lg:text-6xl">
                            {offer.title}
                        </h1>
                        {offer.descshort && (
                            <h2 className="mx-auto max-w-2xl text-xl font-light italic tracking-wide text-stone-600 md:text-2xl">
                                {offer.descshort}
                            </h2>
                        )}
                    </header>

                    {offer.content && (
                        <div className="prose prose-lg mx-auto max-w-3xl prose-headings:font-serif prose-headings:font-light prose-headings:text-stone-800 prose-p:font-light prose-p:leading-relaxed prose-p:text-stone-600 prose-a:text-stone-800 prose-a:underline-offset-4 hover:prose-a:text-stone-600">
                            <RichText data={offer.content} enableGutter={false} enableProse={false} />
                        </div>
                    )}

                    {offer.photos?.length > 0 && (
                        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {offer.photos.map((photo, index) => {
                                // Handle both populated and non-populated photo references
                                const photoData = typeof photo === 'number' ? null : photo;
                                if (!photoData?.url) return null;

                                return (
                                    <div
                                        key={photoData.url || index}
                                        className="group aspect-[3/4] overflow-hidden rounded-lg bg-stone-100 shadow-lg transition duration-300 hover:shadow-xl"
                                    >
                                        <div className="relative h-full w-full">
                                            <Image
                                                src={photoData.url}
                                                alt={offer.title}
                                                fill
                                                className="object-cover transition duration-300 group-hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/0 to-stone-950/20 transition duration-300 group-hover:to-stone-950/10" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                </article>
            </main>
        </div>
    );
}
