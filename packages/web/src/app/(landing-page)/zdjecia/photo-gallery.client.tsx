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


export function PhotoGallery({ photos }: PhotoGalleryProps) {
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [lightboxOpen, setLightboxOpen] = useState(false); const [columns, setColumns] = useState<Column[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [columnCount, setColumnCount] = useState(4);

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

            const aspectRatio = width / height;

            // Assuming the column width is 1 unit, calculate the height contribution
            const heightContribution = 1 / aspectRatio;

            console.log(heightContribution);

            newColumns[minHeightColumn]!.photos.push(photo);
            newColumns[minHeightColumn]!.height += heightContribution;
        });

        // Balance column heights by adjusting photo sizes
        balanceColumnHeights(newColumns);

        console.log(newColumns);

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

            // Calculate how much to adjust each photo
            const totalAdjustment = heightDifference;
            const adjustedPhotos = column.photos.map(photo => {
                const width = photo.sizes?.thumbnail?.width;
                const height = photo.sizes?.thumbnail?.height;

                const originalAspectRatio = width / height;
                const originalHeightContribution = 1 / originalAspectRatio;

                // Distribute adjustment proportionally to photo's height
                const heightProportion = originalHeightContribution / column.height;
                const heightAdjustment = totalAdjustment * heightProportion;

                return {
                    ...photo,
                    heightAdjustment,
                };
            });

            column.photos = adjustedPhotos;
        });
    };

    const openLightbox = (photo: Photo) => {
        setSelectedPhoto(photo);
        setLightboxOpen(true);
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
            {/* Photo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {photos.map((photo) => (
                    <PhotoTile
                        key={photo.id}
                        photo={photo}
                        onClick={openLightbox}
                        linkToPage={false}
                    />
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
                        <Image
                            src={selectedPhoto.url ?? selectedPhoto.url}
                            alt={selectedPhoto.alt}
                            fill
                            sizes="90vw"
                            className="object-contain"
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