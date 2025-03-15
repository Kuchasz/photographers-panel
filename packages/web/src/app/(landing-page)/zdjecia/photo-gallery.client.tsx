'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, X } from '@phosphor-icons/react';
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
    const [lightboxLoading, setLightboxLoading] = useState(true);

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

    const openLightbox = (photo: Photo) => {
        setSelectedPhoto(photo);
        setLightboxOpen(true);
        setLightboxLoading(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = 'auto';
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
                    <button
                        onClick={closeLightbox}
                        className="absolute cursor-pointer top-4 right-4 text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors z-10"
                        aria-label="Close lightbox"
                    >
                        <X size={24} weight="bold" />
                    </button>

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
                        {/* Enhanced lightbox skeleton with shimmer effect */}
                        <div 
                            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${lightboxLoading ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <div className="w-full h-full max-w-[80%] max-h-[80%] rounded-lg overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-stone-300 via-stone-200 to-stone-300 animate-pulse" />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-50/30 to-transparent animate-shimmer" />
                            </div>
                        </div>
                        
                        <Image
                            src={selectedPhoto.url ?? selectedPhoto.url}
                            alt={selectedPhoto.alt}
                            fill
                            sizes="90vw"
                            className={`object-contain transition-all duration-500 ${lightboxLoading ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`}
                            onLoad={() => setLightboxLoading(false)}
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