import { getPayload } from "payload";
import { notFound } from "next/navigation";
import Link from "next/link";
import { strings } from "~/resources";
import payloadConfig from "~/payload.config";

export async function generateStaticParams() {
    const payload = await getPayload({
        config: payloadConfig,
    });

    const { docs: videos } = await payload.find({
        collection: 'videos',
        sort: ['order'],
    });

    return videos.map((video) => ({
        alias: video.alias,
    }));
}

interface VideoDetailPageProps {
    params: Promise<{
        alias: string;
    }>;
}

export default async function VideoDetailPage({ params }: VideoDetailPageProps) {
    const { alias } = await params;

    const payload = await getPayload({
        config: payloadConfig,
    });

    // Find the video by alias
    const { docs: videos } = await payload.find({
        collection: 'videos',
        where: {
            alias: {
                equals: alias,
            },
        },
    });

    const video = videos[0];

    // If video not found, return 404
    if (!video) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
            <main className="container mx-auto px-4 py-16 md:py-24">
                <Link
                    href="/filmy"
                    className="inline-flex items-center mb-8 text-stone-600 hover:text-stone-800 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    {strings.menu.videos}
                </Link>

                <header className="mb-12">
                    <h1 className="mb-4 font-serif text-3xl font-light tracking-wide text-stone-800 md:text-4xl">
                        {video.title}
                    </h1>
                    {video.desc && (
                        <p className="max-w-3xl text-lg font-light text-stone-600">
                            {video.desc}
                        </p>
                    )}
                </header>

                <div className="mx-auto max-w-4xl">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg">
                        <iframe
                            src={video.videoUrl}
                            title={video.title}
                            className="absolute inset-0 h-full w-full"
                            allow="autoplay; encrypted-media; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            </main>
        </div>
    );
} 