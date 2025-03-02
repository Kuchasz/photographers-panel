'use client';

import { tsr } from "~/api";
import { strings } from "~/resources";

export default function VideosPage() {

    const { data, isLoading } = tsr.video.getVideosList.useQuery({ queryKey: ['videos'] });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (data?.status !== 200) {
        return <div>Error</div>;
    }

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
                    <div className="grid gap-8 md:gap-12">
                        {data.body.map((video) => (
                            <div
                                key={video.videoUrl}
                                className="group relative overflow-hidden rounded-lg bg-stone-100 shadow-lg transition duration-300 hover:shadow-xl"
                            >
                                <div className="relative aspect-video w-full">
                                    <iframe
                                        src={video.videoUrl}
                                        title={video?.title}
                                        className="absolute inset-0 h-full w-full"
                                        allow="autoplay; encrypted-media; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                                {video?.title && (
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/80 to-transparent p-6 opacity-0 transition duration-300 group-hover:opacity-100">
                                        <h2 className="font-serif text-xl font-light text-white">
                                            {video.title}
                                        </h2>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}