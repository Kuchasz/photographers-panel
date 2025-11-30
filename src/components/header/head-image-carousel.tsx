'use client';
import Image from "next/image";
import React from "react";
import { first, nextElement } from "~/lib/array";

const getSrc = (photo: TopPhoto, ext: string) => `/images/top/${photo.id}${ext}`;

export interface TopPhoto {
    id: string;
    focusX: number;
    focusY: number;
}

interface HeadImageCarouselProps {
    photos: TopPhoto[];
    interval?: number;
}

export const HeadImageCarousel: React.FC<HeadImageCarouselProps> = ({ photos, interval = 5000 }) => {
    const [{ currentPhoto, prevPhoto }, setCurrentPhoto] = React.useState({
        prevPhoto: null as TopPhoto | null,
        currentPhoto: first(photos) as TopPhoto,
    });
    const [scrollY, setScrollY] = React.useState(0);

    // Track current photo for carousel
    React.useEffect(() => {
        const timer = setTimeout(() => {
            const nextPhoto = nextElement(photos, currentPhoto) as TopPhoto;
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
                            style={{ objectPosition: `${nextPhoto.focusX}% ${nextPhoto.focusY}%` }}
                            objectFit="cover"
                            fill
                            priority
                        />
                    </div>
                );
            })()}

            {prevPhoto && (
                <div
                    key={prevPhoto.id}
                    className="absolute inset-0"
                    style={{ transform: parallaxTransform }}>
                    <Image
                        alt={prevPhoto.id.split('-').join(' ')}
                        style={{ objectPosition: `${prevPhoto.focusX}% ${prevPhoto.focusY}%` }}
                        src={getSrc(prevPhoto, '.jpg')}
                        objectFit="cover"
                        fill
                        priority
                    />
                </div>
            )}
            <div
                key={currentPhoto.id}
                className={`absolute inset-0 ${!prevPhoto ? 'animate-fadeIn' : 'animate-fade'}`}
                style={{ transform: parallaxTransform }}>
                <Image
                    alt={currentPhoto.id.split('-').join(' ')}
                    style={{ objectPosition: `${currentPhoto.focusX}% ${currentPhoto.focusY}%` }}
                    src={getSrc(currentPhoto, '.jpg')}
                    objectFit="cover"
                    fill
                    priority
                />
            </div>
        </div>
    );
}; 