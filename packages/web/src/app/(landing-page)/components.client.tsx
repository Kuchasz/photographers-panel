'use client';

import { ArrowLeft, ArrowRight, Play, Star } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { type Opinion, type Photo, type Video } from "./actions";
import { strings } from "../../resources";
import { Button } from "~/components/button";
import { routes } from "~/routes";
import { useRouter } from "next/navigation";
import Image from "next/image";
// Navigation Button Component 
type NavigationButtonProps = {
    direction: 'left' | 'right';
    onClick: () => void;
    disabled?: boolean;
    ariaLabel: string;
};

const NavigationButton = ({ direction, onClick, disabled = false, ariaLabel }: NavigationButtonProps) => {
    const Icon = direction === 'left' ? ArrowLeft : ArrowRight;

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-stone-200 bg-white shadow-sm transition-all hover:bg-gold-50 hover:border-gold-200 hover:scale-110 ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white'
                }`}
            aria-label={ariaLabel}
        >
            <Icon size={16} weight="bold" className="text-stone-600" />
        </button>
    );
};

// Photo Grid Component
type PhotoGridProps = {
    photos: Photo[];
};

export const PhotoGrid = ({ photos }: PhotoGridProps) => {
    const router = useRouter();
    const [visiblePhotos, setVisiblePhotos] = useState<Photo[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const gapSize = 4; // 0.25rem = 4px gap between photos (reduced from 16px)

    // Reference to the container element
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Display all photos we received
        setVisiblePhotos(photos);

        // Set initial index to the middle of the array
        if (photos.length > 0) {
            const middleIndex = Math.floor(photos.length / 2);
            setCurrentIndex(middleIndex);
        }
    }, [photos]);

    useEffect(() => {
        // Function to update container width
        const updateContainerWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        // Initial measurement
        updateContainerWidth();

        // Add resize event listener
        window.addEventListener('resize', updateContainerWidth);

        // Clean up
        return () => {
            window.removeEventListener('resize', updateContainerWidth);
        };
    }, []);

    if (!photos.length) return null;

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => {
            return Math.min(visiblePhotos.length - 1, prevIndex + 1);
        });
    };

    // Calculate if navigation buttons should be enabled
    const canScrollLeft = currentIndex > 0;
    const canScrollRight = currentIndex < (visiblePhotos.length - 1);

    // Calculate photo widths based on container width, aspect ratios, and gaps
    const getPhotoStyles = () => {
        if (!containerWidth || visiblePhotos.length === 0 || currentIndex >= visiblePhotos.length) {
            return { transform: 'translateX(0)' }; // Default fallback
        }

        const height = 484; // Increased from 384px to 484px (added 100px)

        // Calculate widths for all visible photos
        const photoWidths = visiblePhotos.map(photo => {
            const aspectRatio = photo.width / photo.height;
            return height * aspectRatio;
        });

        // Calculate center position
        const centerPosition = containerWidth / 2;

        // Calculate how much to translate to center the current photo
        let translateX = 0;
        let currentPhotoLeftEdge = 0;

        // Calculate position of current photo
        for (let i = 0; i < currentIndex; i++) {
            const photoWidth = photoWidths[i];
            if (photoWidth !== undefined) {
                currentPhotoLeftEdge += photoWidth + gapSize;
            }
        }

        // Width of current photo
        const currentPhotoWidth = photoWidths[currentIndex] ?? 0;

        // Calculate translation to center the current photo
        translateX = centerPosition - currentPhotoLeftEdge - (currentPhotoWidth / 2);

        return {
            transform: `translateX(${translateX}px)`,
            transition: 'transform 300ms ease-in-out'
        };
    };

    // Get width style for individual photo
    const getPhotoWidth = (photo: Photo) => {
        const height = 484; // Increased from 384px to 484px (added 100px)
        const aspectRatio = photo.width / photo.height;
        const photoWidth = height * aspectRatio;

        return {
            width: `${photoWidth}px`,
            minWidth: `${photoWidth}px`,
        };
    };

    const handlePhotoClick = (index: number) => {
        if (index === currentIndex) {
            // Navigate to photos page when clicking the current photo
            router.push(routes.photos.route);
        } else {
            // Otherwise just center the clicked photo
            setCurrentIndex(index);
        }
    };

    return (
        <div className="space-y-6">
            {/* Text description */}
            <div className="mx-auto max-w-2xl text-center">
                <p className="font-light leading-relaxed text-stone-600 mb-4">
                    {strings.featuredPhotos.description}
                </p>
            </div>

            {/* Full width container with horizontal layout and navigation */}
            <div className="relative w-full" ref={containerRef}>
                {/* Photo strip */}
                <div className="relative w-full overflow-hidden">
                    <div
                        className="flex h-[484px] gap-1 transition-all duration-300 ease-in-out"
                        style={getPhotoStyles()}
                    >
                        {visiblePhotos.map((photo, index) => (
                            <div
                                key={photo.id}
                                className="relative flex-none h-full transition-all duration-300 cursor-pointer"
                                style={getPhotoWidth(photo)}
                                onClick={() => handlePhotoClick(index)}
                            >
                                <div className="relative h-full overflow-hidden">
                                    <img
                                        src={photo.url}
                                        alt={photo.alt}
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation buttons centered below */}
                <div className="flex justify-center gap-24 mt-4">
                    <NavigationButton
                        direction="left"
                        onClick={handlePrevious}
                        disabled={!canScrollLeft}
                        ariaLabel="Previous photos"
                    />
                    <NavigationButton
                        direction="right"
                        onClick={handleNext}
                        disabled={!canScrollRight}
                        ariaLabel="Next photos"
                    />
                </div>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center mt-6">
                <Button
                    href={routes.photos.route}
                    variant="hero"
                >
                    <div className="flex items-center gap-2">
                        <span>{strings.featuredPhotos.cta}</span>
                    </div>
                </Button>
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
            <div className="mx-auto max-w-5xl">
                <div className="min-h-[200px] rounded-lg bg-white p-8 shadow-lg flex items-center justify-center">
                    <p className="text-center font-light text-stone-500">No opinions available at the moment.</p>
                </div>
            </div>
        );
    }

    const goToPrevOpinion = () => {
        setCurrentOpinionIndex((prev) => (prev - 1 + opinions.length) % opinions.length);
    };

    const goToNextOpinion = () => {
        setCurrentOpinionIndex((prev) => (prev + 1) % opinions.length);
    };

    return (
        <div className="mx-auto max-w-5xl">
            <div className="relative min-h-[450px] overflow-hidden rounded-lg shadow-md">
                <div
                    style={{
                        transform: `translateX(${currentOpinionIndex * -100}%)`,
                    }}
                    className="absolute inset-0 flex w-full transition-transform duration-500"
                >
                    {opinions.map((opinion, index) => (
                        <div
                            key={opinion.id}
                            style={{
                                transform: `translateX(${index * 100}%)`,
                            }}
                            className={`absolute w-full h-full grid grid-cols-1 md:grid-cols-2 transition-opacity duration-500 ${index === currentOpinionIndex ? "opacity-100" : "opacity-0"}`}
                        >
                            {/* Left side - Photo */}
                            <div className="w-full md:h-full bg-stone-100 overflow-hidden relative">
                                <Image
                                    fill
                                    src={opinion.media?.url ?? "https://mangostudios.com/wp-content/uploads/2024/10/alessia-and-lucas.webp"}
                                    alt={opinion.media?.alt ?? `${opinion.author} testimonial`}
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>

                            {/* Right side - Testimonial content */}
                            <div className="bg-white p-8 md:p-12 flex flex-col justify-between">
                                <div className="space-y-6">
                                    {/* Quote icon */}
                                    <div className="mb-6 text-gold-400 opacity-40">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                                            <path d="M9.58,13.69A4.83,4.83,0,0,1,8,17.94a6.91,6.91,0,0,1-5.33,2.2v-2.5a4.52,4.52,0,0,0,3.33-1.36,4.59,4.59,0,0,0,1.39-2.5H4.66V7.53h4.92Z" />
                                            <path d="M19.58,13.69A4.83,4.83,0,0,1,18,17.94a6.91,6.91,0,0,1-5.33,2.2v-2.5a4.52,4.52,0,0,0,3.33-1.36,4.59,4.59,0,0,0,1.39-2.5H14.66V7.53h4.92Z" />
                                        </svg>
                                    </div>

                                    {/* Customer Name */}
                                    <h3 className="font-serif text-3xl text-stone-800">{opinion.author}</h3>

                                    {/* Quote */}
                                    <p className="text-xl italic font-serif text-gold-600">&ldquo;{opinion.title}...&rdquo;</p>

                                    {/* Full testimonial */}
                                    <p className="font-light leading-relaxed text-stone-600">{opinion.content}</p>
                                </div>

                                <div className="mt-8 flex items-center justify-between">
                                    {/* Rating Stars */}
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: opinion.rating }).map((_, i) => (
                                            <Star key={i} size={18} weight="fill" className="text-gold-500" />
                                        ))}
                                    </div>

                                    {/* Source and Date */}
                                    <div className="text-right border-l border-stone-200 pl-4">
                                        <p className="text-sm font-light text-stone-500">
                                            {opinion.source in strings.opinions.sources
                                                ? strings.opinions.sources[opinion.source as keyof typeof strings.opinions.sources]
                                                : opinion.source}
                                            {" · "}
                                            {opinion.date}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation controls */}
            <div className="mt-8 flex justify-center gap-4">
                <div className="flex items-center space-x-4">
                    <NavigationButton
                        direction="left"
                        onClick={goToPrevOpinion}
                        ariaLabel="Previous opinion"
                    />

                    <div className="flex gap-3">
                        {opinions.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentOpinionIndex(index)}
                                className={`h-3 w-3 rounded-full transition-all ${index === currentOpinionIndex
                                    ? "bg-gold-500 scale-110"
                                    : "bg-stone-200 hover:bg-stone-300"
                                    }`}
                                aria-label={`Go to opinion ${index + 1}`}
                            />
                        ))}
                    </div>

                    <NavigationButton
                        direction="right"
                        onClick={goToNextOpinion}
                        ariaLabel="Next opinion"
                    />
                </div>
            </div>
        </div>
    );
};

// Featured Videos Grid Component
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