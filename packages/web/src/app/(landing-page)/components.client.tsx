'use client';

import { CaretRight, Image, InstagramLogo, Play, Star } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { type InstagramPost, type Opinion } from "./actions";
import { strings } from "../../resources";

// Instagram Grid Component
type InstagramGridProps = {
    posts: InstagramPost[];
};

const getMediaTypeIcon = (mediaType: InstagramPost['media_type']) => {
    switch (mediaType) {
        case 'VIDEO':
            return <Play weight="fill" className="text-white" />;
        case 'CAROUSEL_ALBUM':
            return <CaretRight weight="fill" className="text-white" />;
        default:
            return <Image weight="fill" className="text-white" />;
    }
};

export const InstagramGrid = ({ posts }: InstagramGridProps) => {
    const [visiblePosts, setVisiblePosts] = useState<InstagramPost[]>([]);

    useEffect(() => {
        // Adjust number of visible posts based on screen size
        const handleResize = () => {
            if (window.innerWidth < 640) {
                // Mobile: show 3 posts
                setVisiblePosts(posts.slice(0, 3));
            } else if (window.innerWidth < 1024) {
                // Tablet: show 4 posts
                setVisiblePosts(posts.slice(0, 4));
            } else {
                // Desktop: show all 6 posts
                setVisiblePosts(posts);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [posts]);

    if (!posts.length) return null;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                {visiblePosts.map((post) => (
                    <Link
                        key={post.id}
                        href={post.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative overflow-hidden rounded-lg bg-stone-100 aspect-square"
                    >
                        {/* Post image */}
                        <img
                            src={post.thumbnail_url ?? post.media_url}
                            alt={post.caption ?? "Instagram post"}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />

                        {/* Overlay with fade effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        {/* Media type indicator in top right corner */}
                        <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60">
                            {getMediaTypeIcon(post.media_type)}
                        </div>

                        {/* Caption on hover */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <p className="line-clamp-2 text-sm font-light">
                                {post.caption ?? ""}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="flex justify-center">
                <Link
                    href="https://www.instagram.com/pyszstudio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-stone-600 transition-colors hover:text-stone-800"
                >
                    <InstagramLogo size={20} weight="fill" className="transform transition-transform group-hover:scale-125" />
                    <span className="font-serif text-lg font-light">{strings.instagram.followUs}</span>
                </Link>
            </div>
        </div>
    );
};

// Opinion Carousel Component
export const OpinionCarousel = ({ opinions }: { opinions: Opinion[] }) => {
    const [currentOpinionIndex, setCurrentOpinionIndex] = useState(0);

    useEffect(() => {
        if (opinions.length === 0) return;

        const timer = setInterval(() => {
            setCurrentOpinionIndex((prev) => (prev + 1) % opinions.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [opinions]);

    // Display a fallback message when no opinions are available
    if (opinions.length === 0) {
        return (
            <div className="mx-auto max-w-3xl">
                <div className="min-h-[200px] rounded-lg bg-white p-8 shadow-lg flex items-center justify-center">
                    <p className="text-center font-light text-stone-500">No opinions available at the moment.</p>
                </div>
            </div>
        );
    }

    return <div className="mx-auto max-w-3xl">
        <div className="relative min-h-[200px] flex overflow-hidden rounded-lg p-8 shadow-lg">
            <div style={{
                transform: `translateX(${currentOpinionIndex * -100}%)`,
            }} className="absolute inset-0 flex w-full transition-transform duration-500">
                {opinions.map((opinion, index) => (
                    <div
                        key={opinion.id}
                        style={{
                            transform: `translateX(${index * 100}%)`,
                        }}
                        className={`absolute w-full flex transform flex-col justify-between p-8 transition-all duration-500 ${index === currentOpinionIndex ? "opacity-100" : "opacity-0"}`}
                    >
                        <div>
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <p className="font-serif text-xl font-light text-stone-800">{opinion.author}</p>
                                    <p className="text-sm font-light text-stone-500">
                                        {/* Fix for the linter error - check if opinion.source exists in strings.opinions.sources */}
                                        {opinion.source in strings.opinions.sources
                                            ? strings.opinions.sources[opinion.source as keyof typeof strings.opinions.sources]
                                            : opinion.source}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: opinion.rating }).map((_, i) => (
                                        <Star key={i} size={16} weight="fill" className="text-yellow-400" />
                                    ))}
                                </div>
                            </div>
                            <p className="font-light leading-relaxed text-stone-600">{opinion.content}</p>
                        </div>
                        <p className="text-right text-sm font-light text-stone-400">{opinion.date}</p>
                    </div>
                ))}
            </div>
        </div>
        <div className="mt-6 flex justify-center gap-2">
            {opinions.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentOpinionIndex(index)}
                    className={`h-2 w-2 rounded-full transition-all ${index === currentOpinionIndex ? "bg-stone-400" : "bg-stone-200"
                        }`}
                    aria-label={`Go to opinion ${index + 1}`}
                />
            ))}
        </div>
    </div>
}; 