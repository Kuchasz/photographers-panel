import { strings } from "~/resources";
import Link from "next/link";
import { PageContainer } from "~/components/page-container";
import { SectionTitle } from "~/components/section-title";
import { type Metadata } from 'next';
import { getVideos } from "./actions";

export const metadata: Metadata = {
    title: 'Filmy | Fotografia',
    description: 'Kolekcja profesjonalnych filmów z ślubów, uroczystości i wydarzeń specjalnych.',
};

export const dynamic = 'force-dynamic';

export default async function VideosPage() {
    const videos = await getVideos();

    return (
        <PageContainer>
            <header>
                <SectionTitle
                    title={strings.menu.videos}
                    subtitle={strings.pageTitles.videos}
                />
            </header>

            {videos.length === 0 ? (
                <div className="py-12 text-center">
                    <p className="text-lg text-stone-600">
                        Galeria filmów jest obecnie pusta. Wróć wkrótce, aby zobaczyć nowe materiały.
                    </p>
                </div>
            ) : (
                <section className="mx-auto max-w-7xl pb-16">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map((video) => (
                            <Link
                                key={video.videoUrl}
                                href={`/filmy/${video.alias}`}
                                aria-label={`Watch ${video.title || 'video'}`}>
                                <div
                                    className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition duration-300 aspect-video bg-black/5"
                                >
                                    {/* Thumbnail */}
                                    {video.videoUrl?.includes('youtube.com/embed/') && (
                                        <img
                                            src={`https://img.youtube.com/vi/${video.videoUrl.split('/').pop()}/maxresdefault.jpg`}
                                            alt={video?.title || 'Video thumbnail'}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    )}

                                    {/* Play button overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center z-10">
                                        <div className="rounded-full bg-stone-900/80 p-3 pl-4 text-white transition-transform duration-300 group-hover:scale-110 shadow-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300"></div>

                                    {/* Text content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                                        <h2 className="font-serif text-xl font-light text-white mb-1 line-clamp-2 drop-shadow-md">
                                            {video.title}
                                        </h2>
                                        {video.descshort && (
                                            <p className="text-white/90 text-sm mb-2 line-clamp-2 drop-shadow-md font-light">
                                                {video.descshort}
                                            </p>
                                        )}
                                        <div className="pt-1">
                                            <span className="inline-block text-xs text-white/70 bg-black/40 px-2 py-1 rounded font-light">
                                                Kliknij aby obejrzeć
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </PageContainer>
    );
}