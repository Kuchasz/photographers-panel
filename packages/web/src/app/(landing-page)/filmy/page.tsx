import { getPayload } from "payload";
import { strings } from "~/resources";
import payloadConfig from "~/payload.config";
import Link from "next/link";

export default async function VideosPage() {
    const payload = await getPayload({
        config: payloadConfig,
    });

    const { docs: videos } = await payload.find({
        collection: 'videos',
        sort: ['order'],
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
            <main className="container mx-auto px-4 py-16 md:py-24">
                <header className="mb-16 text-center">
                    <h1 className="mb-6 font-serif text-4xl font-light tracking-wide text-stone-800 md:text-5xl lg:text-6xl">
                        {strings.menu.videos}
                    </h1>
                    <p className="mx-auto max-w-2xl text-xl font-light italic tracking-wide text-stone-600">
                        {strings.pageTitles.videos}
                    </p>
                </header>

                <section className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map((video) => (
                            <Link
                                key={video.videoUrl}
                                href={`/filmy/${video.alias}`}
                                aria-label={`Watch ${video.title || 'video'}`}>
                                <div
                                    className="group relative overflow-hidden rounded-lg shadow-lg transition duration-300 hover:shadow-xl aspect-square"
                                    style={{ maxWidth: '300px', maxHeight: '300px', margin: '0 auto' }}
                                >
                                    {/* Thumbnail */}
                                    {video.videoUrl?.includes('youtube.com/embed/') && (
                                        <img
                                            src={`https://img.youtube.com/vi/${video.videoUrl.split('/').pop()}/mqdefault.jpg`}
                                            alt={video?.title || 'Video thumbnail'}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    )}

                                    {/* Play button overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center z-10">
                                        <div className="rounded-full bg-stone-900/80 p-3 pl-4 text-white transition-transform duration-300 group-hover:scale-110">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-30% via-black/60 to-transparent group-hover:opacity-90 transition-opacity duration-300"></div>

                                    {/* Text content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                                        <h2 className="font-serif text-lg font-light text-white mb-1 line-clamp-2 drop-shadow-sm">
                                            {video.title}
                                        </h2>
                                        {video.descshort && (
                                            <p className="text-white/90 text-sm mb-2 line-clamp-2 drop-shadow-sm">{video.descshort}</p>
                                        )}
                                        {video.tags && (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {video.tags.split(',').slice(0, 2).map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full backdrop-blur-sm"
                                                    >
                                                        {tag.trim()}
                                                    </span>
                                                ))}
                                                {video.tags.split(',').length > 2 && (
                                                    <span className="text-xs text-white/80">+{video.tags.split(',').length - 2} more</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}