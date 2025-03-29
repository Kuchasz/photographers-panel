'use client';

import { ArrowLeft, ArrowRight, Download, X } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { type Photo, PhotoTile } from './photo-tile';


type PhotoGalleryProps = {
    photos: Photo[];
    onPhotoDownload?: (photo: Photo) => void;
};

type LightboxProps = {
    photos: Photo[];
    initialPhotoIndex?: number;
    isOpen: boolean;
    onClose: () => void;
    onPhotoDownload?: (photo: Photo) => void;
};

type Column = {
    photos: Photo[];
    height: number;
    adjustedPhotos?: {
        photo: Photo;
        aspectRatio: string;
    }
};

// Gap size in pixels - matches the gap-4 class (1rem = 16px)
const GAP_SIZE = 8;
// Delay before showing loading indicator or starting animations (ms)
const LOADING_DELAY = 300;

function PhotoLightbox({
    photos,
    initialPhotoIndex = 0,
    isOpen,
    onClose,
    onPhotoDownload
}: LightboxProps) {
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(initialPhotoIndex);
    const [lightboxVisible, setLightboxVisible] = useState(false);
    const [lightboxLoading, setLightboxLoading] = useState(false);
    const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
    const [skipAnimation, setSkipAnimation] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);
    const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);
    const loadingStartTimeRef = useRef<number>(0);
    const lightboxRef = useRef<HTMLDivElement>(null);

    // Get the currently selected photo
    const selectedPhoto = photos[selectedPhotoIndex];

    // Initialize the lightbox when it opens
    useEffect(() => {
        if (isOpen) {
            // Set initial state
            setSelectedPhotoIndex(initialPhotoIndex);
            setLightboxVisible(false);
            setShowImage(false);
            document.body.style.overflow = 'hidden';

            // Trigger the entrance animation
            requestAnimationFrame(() => {
                setLightboxVisible(true);
            });

            startLoadingTimer();
        }
    }, [isOpen, initialPhotoIndex]);

    const startLoadingTimer = () => {
        // Clear any existing timer
        if (loadingTimerRef.current) {
            clearTimeout(loadingTimerRef.current);
            loadingTimerRef.current = null;
        }

        // Set loading state
        setLightboxLoading(true);
        setShowLoadingIndicator(false);
        setSkipAnimation(false);
        setShowImage(false);

        // Record start time
        loadingStartTimeRef.current = Date.now();

        // Only show loading indicator if loading takes more than LOADING_DELAY
        loadingTimerRef.current = setTimeout(() => {
            setShowLoadingIndicator(true);
        }, LOADING_DELAY);
    };

    const handleImageLoaded = () => {
        // Calculate how long the image took to load
        const loadTime = Date.now() - loadingStartTimeRef.current;

        // Clear the timer if it exists
        if (loadingTimerRef.current) {
            clearTimeout(loadingTimerRef.current);
            loadingTimerRef.current = null;
        }

        // If the image loaded quickly (< LOADING_DELAY), skip all animations
        if (loadTime < LOADING_DELAY) {
            setSkipAnimation(true);
            setShowLoadingIndicator(false);
            setLightboxLoading(false);
            setShowImage(true);
        } else {
            // If loading took longer, keep the indicator visible briefly before fading out
            setLightboxLoading(false);

            // Start the transition animation
            setShowImage(true);

            // Hide the loading indicator after a short delay
            setTimeout(() => {
                setShowLoadingIndicator(false);
            }, 100); // Short delay to allow for a smooth transition
        }
    };

    const closeLightbox = () => {
        // Start exit animation
        setLightboxVisible(false);
        setShowImage(false);

        // Wait for animation to complete before removing from DOM
        setTimeout(() => {
            onClose();
            document.body.style.overflow = 'auto';
        }, 300);

        // Clear any pending timers when closing
        if (loadingTimerRef.current) {
            clearTimeout(loadingTimerRef.current);
            loadingTimerRef.current = null;
        }
    };

    const navigatePhoto = (direction: 'next' | 'prev') => {
        let newIndex;

        if (direction === 'next') {
            newIndex = (selectedPhotoIndex + 1) % photos.length;
        } else {
            newIndex = (selectedPhotoIndex - 1 + photos.length) % photos.length;
        }

        startLoadingTimer();
        setSelectedPhotoIndex(newIndex);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowRight':
                navigatePhoto('next');
                break;
            case 'ArrowLeft':
                navigatePhoto('prev');
                break;
            case 'Escape':
                closeLightbox();
                break;
            default:
                break;
        }
    };

    // Preload adjacent images to leverage browser cache
    useEffect(() => {
        if (!isOpen) return;

        const nextIndex = (selectedPhotoIndex + 1) % photos.length;
        const prevIndex = (selectedPhotoIndex - 1 + photos.length) % photos.length;

        // Preload next and previous images
        if (photos[nextIndex]) {
            const nextImg = new window.Image();
            nextImg.src = photos[nextIndex].sizes?.big?.url || photos[nextIndex].url;
        }

        if (photos[prevIndex]) {
            const prevImg = new window.Image();
            prevImg.src = photos[prevIndex].sizes?.big?.url || photos[prevIndex].url;
        }
    }, [selectedPhotoIndex, isOpen, photos]);

    // Clean up any timers when component unmounts
    useEffect(() => {
        return () => {
            if (loadingTimerRef.current) {
                clearTimeout(loadingTimerRef.current);
            }
        };
    }, []);

    const handleDownload = (e: React.MouseEvent, photo: Photo) => {
        // Call the callback if provided
        if (onPhotoDownload) {
            // If the callback is provided, we might want to let the parent component
            // handle the download logic, so prevent the default anchor behavior
            e.preventDefault();
            onPhotoDownload(photo);
        }
        // If no callback is provided, the default anchor behavior will proceed
    };

    if (!isOpen || !selectedPhoto) return null;

    return (
        <div
            ref={lightboxRef}
            className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ease-in-out ${lightboxVisible ? 'bg-black/95' : 'bg-black/0'}`}
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            <div className={`absolute top-4 right-4 flex items-center space-x-2 z-10 transition-opacity duration-300 ${lightboxVisible ? 'opacity-100' : 'opacity-0'}`}>
                {onPhotoDownload && (
                    <a
                        href={selectedPhoto.sizes?.big?.url || selectedPhoto.url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
                        aria-label="Download original photo"
                        onClick={(e) => handleDownload(e, selectedPhoto)}
                    >
                        <Download size={24} weight="bold" />
                    </a>
                )}

                <button
                    onClick={closeLightbox}
                    className="cursor-pointer text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
                    aria-label="Close lightbox"
                >
                    <X size={24} weight="bold" />
                </button>
            </div>

            <button
                onClick={() => navigatePhoto('prev')}
                className={`absolute cursor-pointer left-4 text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-all duration-300 z-10 ${lightboxVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                aria-label="Previous photo"
            >
                <ArrowLeft size={24} weight="bold" />
            </button>

            <button
                onClick={() => navigatePhoto('next')}
                className={`absolute cursor-pointer right-4 text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-all duration-300 z-10 ${lightboxVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
                aria-label="Next photo"
            >
                <ArrowRight size={24} weight="bold" />
            </button>

            <div className={`relative w-full h-full flex items-center justify-center transition-transform duration-300 ${lightboxVisible ? 'scale-100' : 'scale-95'}`}>
                {/* Subtle spinner - only shown if loading takes more than LOADING_DELAY */}
                {showLoadingIndicator && (
                    <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 z-10">
                        <div className="spinner"></div>
                    </div>
                )}

                <div className={`relative w-full h-full ${skipAnimation ? '' : 'transition-opacity duration-500'} ${showImage ? 'opacity-100' : 'opacity-0'}`}>
                    <img
                        ref={imageRef}
                        src={selectedPhoto.sizes?.big?.url || selectedPhoto.url}
                        alt={selectedPhoto.alt}
                        className={`w-full h-full object-contain ${skipAnimation ? '' : 'transition-transform duration-500'} ${showImage ? 'scale-100' : 'scale-[0.98]'}`}
                        onLoad={handleImageLoaded}
                    />
                    {/* <Image
                        ref={imageRef}
                        src={selectedPhoto.sizes?.big?.url || selectedPhoto.url}
                        alt={selectedPhoto.alt}
                        fill
                        sizes="90vw"
                        className={`object-contain ${skipAnimation ? '' : 'transition-transform duration-500'} ${showImage ? 'scale-100' : 'scale-[0.98]'}`}
                        onLoad={handleImageLoaded}
                        priority
                    /> */}
                </div>

                <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent transition-all duration-300 ${lightboxVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <h2 className="text-white font-serif text-xl font-light">{selectedPhoto.alt}</h2>
                </div>
            </div>
        </div>
    );
}

export function PhotoGallery({
    photos,
    onPhotoDownload
}: PhotoGalleryProps) {
    const [columns, setColumns] = useState<Column[]>([]);
    const [columnCount, setColumnCount] = useState(4);
    const containerRef = useRef<HTMLDivElement>(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [initialPhotoIndex, setInitialPhotoIndex] = useState(0);

    // Determine column count based on screen width
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setColumnCount(1);
            } else if (width < 1024) {
                setColumnCount(2);
            } else {
                setColumnCount(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Distribute photos into columns
    useEffect(() => {
        if (photos.length === 0 || columnCount === 0) return;

        // Initialize columns
        const newColumns: Column[] = Array.from({ length: columnCount }, () => ({
            photos: [],
            height: 0
        }));

        // Distribute photos to columns by height
        photos.forEach(photo => {
            // Find column with minimum height
            const minHeightColumn = newColumns.reduce(
                (min, col, i) => col.height < newColumns[min]!.height ? i : min,
                0
            );

            // Add photo to column
            const width = photo.sizes?.thumbnail?.width;
            const height = photo.sizes?.thumbnail?.height;

            if (typeof width !== 'number' || typeof height !== 'number' || width <= 0 || height <= 0) {
                // Skip photos with missing or invalid dimensions
                return;
            }

            // Calculate the height contribution including the gap
            // Only add gap if this isn't the first photo in the column
            const gapContribution = newColumns[minHeightColumn]!.photos.length > 0 ? GAP_SIZE : 0;
            const heightContribution = height + gapContribution;

            newColumns[minHeightColumn]!.photos.push(photo);
            newColumns[minHeightColumn]!.height += heightContribution;
        });

        // Balance column heights by adjusting photo sizes
        balanceColumnHeights(newColumns);

        setColumns(newColumns);
    }, [photos, columnCount]);

    // Function to balance column heights
    const balanceColumnHeights = (columns: Column[]) => {
        if (columns.length <= 1) return;

        // Find the tallest column
        const maxHeight = Math.max(...columns.map(col => col.height));

        // Adjust each column to match the max height
        columns.forEach(column => {
            if (column.photos.length === 0) return;

            const heightDifference = maxHeight - column.height;
            if (heightDifference <= 0) return; // No adjustment needed

            // Calculate total height without gaps to determine proportional adjustments
            const totalPhotoHeight = column.photos.reduce((sum, photo) => {
                return sum + (photo.sizes?.thumbnail?.height || 0);
            }, 0);

            // Total gaps in this column (number of photos - 1) * gap size
            const totalGapHeight = (column.photos.length - 1) * GAP_SIZE;

            // Calculate how much to adjust each photo
            const adjustedPhotos = column.photos.map((photo, index) => {
                const height = photo.sizes?.thumbnail?.height;
                if (!height) return photo;

                // Distribute adjustment proportionally to photo's height relative to total photo height
                const heightProportion = height / totalPhotoHeight;
                const heightAdjustment = heightDifference * heightProportion;

                return {
                    ...photo,
                    sizes: {
                        ...photo.sizes,
                        thumbnail: {
                            ...photo.sizes.thumbnail,
                            height: height + heightAdjustment,
                        },
                    },
                    heightAdjustment,
                };
            });

            column.photos = adjustedPhotos;
        });
    };

    const openLightbox = (photo: Photo) => {
        // Find the index of the clicked photo
        const photoIndex = photos.findIndex(p => p.id === photo.id);
        if (photoIndex !== -1) {
            setInitialPhotoIndex(photoIndex);
            setLightboxOpen(true);
        }
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    return (
        <div className="space-y-8">
            {/* Photo Gallery with Flex Columns */}
            <div className="flex flex-wrap gap-2" ref={containerRef}>
                {columns.map((column, columnIndex) => (
                    <div
                        key={`column-${columnIndex}`}
                        className="flex-1 flex flex-col gap-2 min-w-0"
                    >
                        {column.photos.map((photo) => (
                            <PhotoTile
                                key={photo.id}
                                photo={photo}
                                onClick={openLightbox}
                                linkToPage={false}
                                showCaption={false}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* Lightbox Component */}
            <PhotoLightbox
                photos={photos}
                initialPhotoIndex={initialPhotoIndex}
                isOpen={lightboxOpen}
                onClose={closeLightbox}
                onPhotoDownload={onPhotoDownload}
            />
        </div>
    );
} 