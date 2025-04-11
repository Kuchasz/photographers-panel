'use client';

import Link from "next/link";
import { Play } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { type Video } from "~/app/(landing-page)/actions";
import { strings } from "~/resources";
import { Button } from "~/components/button";
import { routes } from "~/routes";

type FeaturedVideosProps = {
    videos: Video[];
};

export const FeaturedVideos = ({ videos }: FeaturedVideosProps) => {
    const router = useRouter();

    if (!videos.length) return null;

    return (
        <div className="space-y-8">
            {/* Description */}
            <div className="mx-auto max-w-2xl text-center">
                <p className="font-light leading-relaxed text-stone-600 mb-6">
                    {strings.featuredVideos.description}
                </p>
            </div>

            {/* Videos grid */}
            <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {videos.map((video) => (
                        <Link
                            key={video.id}
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
                                        <Play size={24} weight="fill" />
                                    </div>
                                </div>

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300"></div>

                                {/* Text content */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                                    <h3 className="font-serif text-xl font-light text-white mb-1 line-clamp-2 drop-shadow-md">
                                        {video.title}
                                    </h3>
                                    {video.descshort && (
                                        <p className="text-white/90 text-sm mb-2 line-clamp-2 drop-shadow-md font-light">
                                            {video.descshort}
                                        </p>
                                    )}
                                    <div className="pt-1">
                                        <span className="inline-block text-xs text-white/70 bg-black/40 px-2 py-1 rounded font-light">
                                            {strings.featuredVideos.watchVideo}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Call to action */}
            <div className="flex justify-center mt-8">
                <Button
                    href={routes.videos.route}
                    variant="default"
                >
                    {strings.featuredVideos.cta}
                </Button>
            </div>
        </div>
    );
}; 