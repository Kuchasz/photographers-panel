'use client';

import { CaretRight, Image, InstagramLogo, Play, Star } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { type InstagramPost, type Opinion, type Photo } from "./actions";
import { strings } from "../../resources";
import { Button } from "~/components/button";
import { routes } from "~/routes";
import { useRouter } from "next/navigation";

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
                <div className="flex justify-center gap-4 mt-4">
                    {/* Left navigation button */}
                    <button
                        onClick={handlePrevious}
                        disabled={!canScrollLeft}
                        className={`flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md transition-opacity ${!canScrollLeft ? 'opacity-30 cursor-not-allowed' : 'hover:bg-stone-50'}`}
                        aria-label="Previous photos"
                    >
                        <CaretRight size={24} className="rotate-180" weight="bold" />
                    </button>

                    {/* Right navigation button */}
                    <button
                        onClick={handleNext}
                        disabled={!canScrollRight}
                        className={`flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md transition-opacity ${!canScrollRight ? 'opacity-30 cursor-not-allowed' : 'hover:bg-stone-50'}`}
                        aria-label="Next photos"
                    >
                        <CaretRight size={24} weight="bold" />
                    </button>
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
        // Always show exactly 4 posts
        setVisiblePosts(posts.slice(0, 4));
    }, [posts]);

    if (!posts.length) return null;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-4 gap-2">
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
                        <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60">
                            {getMediaTypeIcon(post.media_type)}
                        </div>

                        {/* Caption on hover */}
                        <div className="absolute bottom-0 left-0 right-0 p-2 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <p className="line-clamp-1 text-xs font-light">
                                {post.caption ?? ""}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="flex justify-center">
                <Button
                    href="https://www.instagram.com/pyszstudio/"
                    variant="hero"
                >
                    <div className="flex items-center gap-2">
                        <span>{strings.instagram.followUs}</span>
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

    return (
        <div className="mx-auto max-w-5xl">
            <div className="relative min-h-[450px] overflow-hidden">
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
                            className={`absolute w-full grid grid-cols-1 md:grid-cols-2 transition-opacity duration-500 ${index === currentOpinionIndex ? "opacity-100" : "opacity-0"}`}
                        >
                            {/* Left side - Photo */}
                            <div className="h-[300px] md:h-full bg-stone-100 grayscale overflow-hidden">
                                <img
                                    src={opinion.media?.url ?? "https://mangostudios.com/wp-content/uploads/2024/10/alessia-and-lucas.webp"}
                                    alt={opinion.media?.alt ?? `${opinion.author} testimonial`}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Right side - Testimonial content */}
                            <div className="bg-stone-50 p-8 md:p-12 flex flex-col justify-between">
                                <div className="space-y-6">
                                    {/* What They Say About Us */}
                                    <p className="uppercase tracking-wide text-sm text-stone-500 font-light">
                                        {strings.opinions.subtitle}
                                    </p>

                                    {/* Customer Name */}
                                    <h3 className="font-serif text-4xl">{opinion.author}</h3>

                                    {/* Quote */}
                                    <p className="text-xl italic font-serif">&ldquo;{opinion.title}...&rdquo;</p>

                                    {/* Full testimonial */}
                                    <p className="font-light leading-relaxed text-stone-600">{opinion.content}</p>
                                </div>

                                <div className="mt-6 flex items-center justify-between">
                                    {/* Rating Stars */}
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: opinion.rating }).map((_, i) => (
                                            <Star key={i} size={16} weight="fill" className="text-yellow-400" />
                                        ))}
                                    </div>

                                    {/* Source and Date */}
                                    <div className="text-right">
                                        <p className="text-sm font-light text-stone-400">
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

            {/* Navigation dots */}
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
    );
}; 