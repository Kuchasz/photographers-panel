'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { type Photo } from "~/app/(landing-page)/actions";
import { strings } from "~/resources";
import { Button } from "~/components/button";
import { routes } from "~/routes";
import { SectionDescription } from "~/components/section-description";
import { NavigationButton } from "./navigation-button";

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
            <SectionDescription>
                {strings.featuredPhotos.description}
            </SectionDescription>

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