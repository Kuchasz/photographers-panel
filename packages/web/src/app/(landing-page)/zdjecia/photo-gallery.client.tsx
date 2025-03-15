'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, X, Download } from '@phosphor-icons/react';
import { type Photo, PhotoTile } from './photo-tile';

type PhotoGalleryProps = {
    photos: Photo[];
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
const GAP_SIZE = 16;

export function PhotoGallery({ photos }: PhotoGalleryProps) {
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [columns, setColumns] = useState<Column[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [columnCount, setColumnCount] = useState(4);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [lightboxLoading, setLightboxLoading] = useState(false);
    const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);
    const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);
    const loadingStartTimeRef = useRef<number>(0);

    // Determine column count based on screen width
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setColumnCount(1);
            } else if (width < 1024) {
                setColumnCount(2);
            } else if (width < 1280) {
                setColumnCount(3);
            } else {
                setColumnCount(4);
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

    const startLoadingTimer = () => {
        // Clear any existing timer
        if (loadingTimerRef.current) {
            clearTimeout(loadingTimerRef.current);
            loadingTimerRef.current = null;
        }
        
        // Set loading state
        setLightboxLoading(true);
        setShowLoadingIndicator(false);
        
        // Record start time
        loadingStartTimeRef.current = Date.now();
        
        // Only show loading indicator if loading takes more than 300ms
        loadingTimerRef.current = setTimeout(() => {
            setShowLoadingIndicator(true);
        }, 300);
    };

    const handleImageLoaded = () => {
        // Calculate how long the image took to load
        const loadTime = Date.now() - loadingStartTimeRef.current;
        
        // Clear the timer if it exists
        if (loadingTimerRef.current) {
            clearTimeout(loadingTimerRef.current);
            loadingTimerRef.current = null;
        }
        
        // If the image loaded quickly (< 300ms), don't show the loading indicator at all
        if (loadTime < 300) {
            setShowLoadingIndicator(false);
            setLightboxLoading(false);
        } else {
            // If loading took longer, keep the indicator visible briefly before fading out
            setLightboxLoading(false);
            setTimeout(() => {
                setShowLoadingIndicator(false);
            }, 100); // Short delay to allow for a smooth transition
        }
    };

    const openLightbox = (photo: Photo) => {
        setSelectedPhoto(photo);
        setLightboxOpen(true);
        startLoadingTimer();
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = 'auto';
        
        // Clear any pending timers when closing
        if (loadingTimerRef.current) {
            clearTimeout(loadingTimerRef.current);
            loadingTimerRef.current = null;
        }
    };

    const navigatePhoto = (direction: 'next' | 'prev') => {
        if (!selectedPhoto) return;

        const currentIndex = photos.findIndex(photo => photo.id === selectedPhoto.id);
        let newIndex;

        if (direction === 'next') {
            newIndex = (currentIndex + 1) % photos.length;
        } else {
            newIndex = (currentIndex - 1 + photos.length) % photos.length;
        }

        const nextPhoto = photos[newIndex];
        if (nextPhoto) {
            startLoadingTimer();
            setSelectedPhoto(nextPhoto);
        }
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!lightboxOpen) return;

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
        if (!selectedPhoto || !lightboxOpen) return;
        
        const currentIndex = photos.findIndex(photo => photo.id === selectedPhoto.id);
        const nextIndex = (currentIndex + 1) % photos.length;
        const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
        
        // Preload next and previous images
        if (photos[nextIndex]) {
            const nextImg = new window.Image();
            nextImg.src = photos[nextIndex].sizes?.big?.url || photos[nextIndex].url;
        }
        
        if (photos[prevIndex]) {
            const prevImg = new window.Image();
            prevImg.src = photos[prevIndex].sizes?.big?.url || photos[prevIndex].url;
        }
    }, [selectedPhoto, lightboxOpen, photos]);

    // Clean up any timers when component unmounts
    useEffect(() => {
        return () => {
            if (loadingTimerRef.current) {
                clearTimeout(loadingTimerRef.current);
            }
        };
    }, []);

    return (
        <div className="space-y-8" onKeyDown={handleKeyDown} tabIndex={0}>
            {/* Photo Gallery with Flex Columns */}
            <div className="flex flex-wrap gap-4" ref={containerRef}>
                {columns.map((column, columnIndex) => (
                    <div
                        key={`column-${columnIndex}`}
                        className="flex-1 flex flex-col gap-4 min-w-0"
                    >
                        {column.photos.map((photo) => (
                            <PhotoTile
                                key={photo.id}
                                photo={photo}
                                onClick={openLightbox}
                                linkToPage={false}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            {lightboxOpen && selectedPhoto && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
                    <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
                        <a
                            href={selectedPhoto.url}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cursor-pointer text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
                            aria-label="Download original photo"
                        >
                            <Download size={24} weight="bold" />
                        </a>
                        
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
                        className="absolute cursor-pointer left-4 text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors z-10"
                        aria-label="Previous photo"
                    >
                        <ArrowLeft size={24} weight="bold" />
                    </button>

                    <button
                        onClick={() => navigatePhoto('next')}
                        className="absolute cursor-pointer right-4 text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors z-10"
                        aria-label="Next photo"
                    >
                        <ArrowRight size={24} weight="bold" />
                    </button>

                    <div className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center">
                        {/* Subtle spinner - only shown if loading takes more than 300ms */}
                        {showLoadingIndicator && (
                            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 z-10">
                                <div className="spinner"></div>
                            </div>
                        )}
                        
                        <Image
                            ref={imageRef}
                            src={selectedPhoto.sizes?.big?.url || selectedPhoto.url}
                            alt={selectedPhoto.alt}
                            fill
                            sizes="90vw"
                            className={`object-contain transition-all duration-300 ${lightboxLoading ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`}
                            onLoad={handleImageLoaded}
                            priority
                        />

                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                            <h2 className="text-white font-serif text-xl font-light">{selectedPhoto.alt}</h2>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 