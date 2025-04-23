'use client';
import { first, nextElement } from "~/lib/array";
import React from "react";

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

    // Preload all images
    React.useEffect(() => {
        photos.forEach(photo => {
            const img = new Image();
            img.src = getSrc(photo, '.jpg');
        });
    }, [photos]);

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
            {/* Hidden preload images */}
            <div className="hidden">
                {photos.map(photo => (
                    <img
                        key={photo}
                        src={getSrc(photo, '.jpg')}
                        alt=""
                        loading="eager"
                    />
                ))}
            </div>

            {prevPhoto && (
                <picture
                    key={prevPhoto}
                    className="absolute contrast-85 inset-0"
                    style={{ transform: parallaxTransform }}>
                    <source media="(min-width: 700px)" srcSet={getSrc(prevPhoto, '.jpg')} />
                    <img
                        alt={prevPhoto.split('-').join(' ')}
                        className="w-full h-full object-center object-cover"
                        src={getSrc(prevPhoto, '.jpg')}
                        loading="eager" />
                </picture>
            )}
            <picture
                key={currentPhoto}
                className={`absolute contrast-85 inset-0 ${!prevPhoto ? 'animate-fadeIn' : 'animate-fade'}`}
                style={{ transform: parallaxTransform }}>
                <source media="(min-width: 700px)" srcSet={getSrc(currentPhoto, '.jpg')} />
                <img
                    alt={currentPhoto.split('-').join(' ')}
                    className="w-full h-full object-center object-cover"
                    src={getSrc(currentPhoto, '.jpg')}
                    loading="eager" />
            </picture>
            <div className="absolute inset-0 bg-black/20"></div>
        </div>
    );
}; 