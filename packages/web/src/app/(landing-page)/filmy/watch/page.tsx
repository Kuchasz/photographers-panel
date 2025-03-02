import { getPayload } from "payload";
import { redirect } from "next/navigation";
import Link from "next/link";
import { strings } from "~/resources";
import payloadConfig from "~/payload.config";

// Define our own video interface to avoid type errors
interface VideoData {
    id?: number;
    title: string;
    videoUrl: string;
    desc?: string;
    tags?: string | null;
}

interface SearchParams {
    v?: string;
}

export default async function VideoWatchPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const videoUrl = searchParams.v;
    
    if (!videoUrl) {
        redirect('/filmy');
    }
    
    const payload = await getPayload({
        config: payloadConfig,
    });

    // Find the video by videoUrl
    const { docs } = await payload.find({
        collection: 'videos',
        where: {
            videoUrl: {
                equals: videoUrl,
            },
        },
    });

    // Convert the payload response to our VideoData type
    let videoData: VideoData;
    
    if (docs.length > 0) {
        const videoDoc = docs[0];
        // Make sure videoDoc exists and has the required properties
        if (videoDoc && typeof videoDoc.title === 'string' && typeof videoDoc.videoUrl === 'string') {
            videoData = {
                id: typeof videoDoc.id === 'number' ? videoDoc.id : undefined,
                title: videoDoc.title,
                videoUrl: videoDoc.videoUrl,
                desc: typeof videoDoc.desc === 'string' ? videoDoc.desc : undefined,
                tags: typeof videoDoc.tags === 'string' ? videoDoc.tags : null,
            };
        } else {
            // Fallback if the document doesn't have required properties
            videoData = {
                title: "Video",
                videoUrl,
            };
        }
    } else {
        // Fallback for videos not in the database
        videoData = {
            title: "Video",
            videoUrl,
        };
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
            <main className="container mx-auto px-4 py-16 md:py-24">
                <Link 
                    href="/filmy" 
                    className="inline-flex items-center mb-8 text-stone-600 hover:text-stone-800 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    {strings.menu.videos}
                </Link>

                <header className="mb-12">
                    <h1 className="mb-4 font-serif text-3xl font-light tracking-wide text-stone-800 md:text-4xl">
                        {videoData.title}
                    </h1>
                    {videoData.desc && (
                        <p className="max-w-3xl text-lg font-light text-stone-600">
                            {videoData.desc}
                        </p>
                    )}
                </header>

                <div className="mx-auto max-w-4xl">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg">
                        <iframe
                            src={videoData.videoUrl}
                            title={videoData.title}
                            className="absolute inset-0 h-full w-full"
                            allow="autoplay; encrypted-media; picture-in-picture"
                            allowFullScreen
                        />
                    </div>

                    {videoData.tags && (
                        <div className="mt-8">
                            <h2 className="mb-3 text-xl font-light text-stone-700">Tags</h2>
                            <div className="flex flex-wrap gap-2">
                                {videoData.tags.split(',').map((tag: string, index: number) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-stone-200 text-stone-700 text-sm rounded-full"
                                    >
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
} 