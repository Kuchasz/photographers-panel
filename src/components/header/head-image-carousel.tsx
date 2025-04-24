'use client';
import { first, nextElement } from "~/lib/array";
import React from "react";
import Image from "next/image";

const getSrc = (photo: string, ext: string) => `/images/top/${photo}${ext}`;

interface HeadImageCarouselProps {
    photos: string[];
    interval?: number;
}

export const HeadImageCarousel: React.FC<HeadImageCarouselProps> = ({ photos, interval = 5000 }) => {
    const [{ currentPhoto, prevPhoto }, setCurrentPhoto] = React.useState({
        prevPhoto: null as string | null,
        currentPhoto: first(photos) as string,
    });
    const [scrollY, setScrollY] = React.useState(0);

    // Track current photo for carousel
    React.useEffect(() => {
        const timer = setTimeout(() => {
            const nextPhoto = nextElement(photos, currentPhoto) as string;
            setCurrentPhoto({ currentPhoto: nextPhoto, prevPhoto: currentPhoto });
        }, interval);

        return () => clearTimeout(timer);
    }, [currentPhoto, photos, interval]);

    // Track scroll position for parallax effect
    React.useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Get initial scroll position
        handleScroll();

        // Clean up
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Calculate parallax transform (subtle movement)
    const parallaxTransform = `translateY(${scrollY * 0.35}px)`;

    return (
        <div className="relative w-full h-full overflow-hidden">
            {/* Hidden preload image */}
            {(() => {
                const nextPhoto = nextElement(photos, currentPhoto);
                return nextPhoto && (
                    <div className="hidden absolute inset-0">
                        <Image
                            alt=""
                            src={getSrc(nextPhoto, '.jpg')}
                            width={1920}
                            height={1080}
                            priority
                        />
                    </div>
                );
            })()}

            {prevPhoto && (
                <picture
                    key={prevPhoto}
                    className="absolute contrast-85 inset-0"
                    style={{ transform: parallaxTransform }}>
                    <source media="(min-width: 700px)" srcSet={getSrc(prevPhoto, '.jpg')} />
                    <Image
                        alt={prevPhoto.split('-').join(' ')}
                        className="w-full h-full object-center object-cover"
                        src={getSrc(prevPhoto, '.jpg')}
                        width={1920}
                        height={1080}
                        priority
                    />
                </picture>
            )}
            <picture
                key={currentPhoto}
                className={`absolute contrast-85 inset-0 ${!prevPhoto ? 'animate-fadeIn' : 'animate-fade'}`}
                style={{ transform: parallaxTransform }}>
                <source media="(min-width: 700px)" srcSet={getSrc(currentPhoto, '.jpg')} />
                <Image
                    alt={currentPhoto.split('-').join(' ')}
                    className="w-full h-full object-center object-cover"
                    src={getSrc(currentPhoto, '.jpg')}
                    width={1920}
                    height={1080}
                    priority
                />
            </picture>
            <div className="absolute inset-0 bg-black/20"></div>
        </div>
    );
}; 