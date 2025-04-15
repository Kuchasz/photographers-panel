'use client';

import { useEffect, useRef, useState } from 'react';
import { type Photo, PhotoTile } from './photo-tile';
import React from 'react';
import { PhotoLightbox } from './photo-lightbox';
import { debounce } from '~/lib/function';

type PhotoGalleryProps = {
    photos: Photo[];
    onPhotoDownload?: (photo: Photo) => void;
};

type Column = {
    photos: Photo[];
    height: number;
    width: number;
};

// Gap size in pixels - matches the gap-4 class (1rem = 16px)
const GAP_SIZE = 8;

// PhotoTileColumns component to handle column rendering
const PhotoTileColumns = React.memo(({
    columns,
    onPhotoClick,
    onPhotoDownload
}: {
    columns: Column[];
    onPhotoClick: (photo: Photo) => void;
    onPhotoDownload?: (photo: Photo) => void;
}) => {
    return (
        <>
            {columns.map((column, columnIndex) => (
                <div
                    key={`column-${columnIndex}`}
                    className="flex-1 flex flex-col justify-between gap-2 min-w-0"
                >
                    {column.photos.map((photo) => (
                        <MemoizedPhotoTile
                            key={photo.id}
                            photo={photo}
                            onClick={onPhotoClick}
                            onPhotoDownload={onPhotoDownload}
                        />
                    ))}
                </div>
            ))}
        </>
    );
});
PhotoTileColumns.displayName = 'PhotoTileColumns';

// Memoized version of PhotoTile to prevent unnecessary re-renders
const MemoizedPhotoTile = React.memo(PhotoTile, (prevProps, nextProps) => {
    // Only re-render if the photo itself changes
    return prevProps.photo.id === nextProps.photo.id;
});
MemoizedPhotoTile.displayName = 'MemoizedPhotoTile';

export function PhotoGallery({
    photos,
    onPhotoDownload
}: PhotoGalleryProps) {
    const [columns, setColumns] = useState<Column[]>([]);
    const [columnCount, setColumnCount] = useState(3);
    const containerRef = useRef<HTMLDivElement>(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [initialPhotoIndex, setInitialPhotoIndex] = useState(0);

    // Determine column count based on screen width
    useEffect(() => {
        const updateColumnCount = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setColumnCount(1); // Mobile: 1 column
            } else if (width < 768) {
                setColumnCount(2); // Small tablets: 2 columns
            } else if (width < 1024) {
                setColumnCount(3); // Tablets/small laptops: 3 columns
            } else if (width < 1280) {
                setColumnCount(3); // Laptops: 3 columns
            } else {
                setColumnCount(4); // Large screens: 4 columns
            }
        };

        const debouncedUpdateColumnCount = debounce(updateColumnCount, 250);

        updateColumnCount(); // Initial call without debounce
        window.addEventListener('resize', debouncedUpdateColumnCount);
        return () => window.removeEventListener('resize', debouncedUpdateColumnCount);
    }, []);

    // Distribute photos into columns
    useEffect(() => {
        if (photos.length === 0 || columnCount === 0) return;

        // Initialize columns
        const newColumns: Column[] = Array.from({ length: columnCount }, () => ({
            photos: [],
            height: 0,
            width: 0
        }));

        // Calculate the available width per column
        const containerWidth = containerRef.current?.clientWidth ?? 0;
        const gapSpace = GAP_SIZE * (columnCount - 1);
        const availableWidth = containerWidth - gapSpace;
        const columnWidth = availableWidth / columnCount;

        // Set the column width for all columns
        newColumns.forEach(column => {
            column.width = columnWidth;
        });

        // Distribute photos to columns by height
        photos.forEach(photo => {
            // Find column with minimum height
            const minHeightColumn = newColumns.reduce(
                (min, col, i) => col.height < newColumns[min]!.height ? i : min,
                0
            );

            const originalHeight = photo.sizes?.big?.height;
            const originalWidth = photo.sizes?.big?.width;

            if (typeof originalHeight !== 'number' || originalHeight <= 0 ||
                typeof originalWidth !== 'number' || originalWidth <= 0) {
                // Skip photos with missing or invalid dimensions
                return;
            }

            // Calculate the aspect ratio
            const aspectRatio = originalWidth / originalHeight;

            // Calculate the new height based on the column width
            const newHeight = columnWidth / aspectRatio;

            // Calculate the height contribution including the gap
            // Only add gap if this isn't the first photo in the column
            const gapContribution = newColumns[minHeightColumn]!.photos.length > 0 ? GAP_SIZE : 0;
            const heightContribution = newHeight + gapContribution;

            // Create a new photo object with adjusted dimensions
            const adjustedPhoto = {
                ...photo,
                sizes: {
                    ...photo.sizes,
                    big: {
                        ...photo.sizes.big,
                        width: columnWidth,
                        height: newHeight,
                    }
                }
            };

            newColumns[minHeightColumn]!.photos.push(adjustedPhoto);
            newColumns[minHeightColumn]!.height += heightContribution;
        });

        // Balance column heights after initial distribution
        balanceColumnHeights(newColumns);

        setColumns(newColumns);
    }, [photos, columnCount]);

    // Function to balance column heights
    const balanceColumnHeights = (columns: Column[]) => {
        if (columns.length <= 1) return;

        // Find the tallest column
        const maxHeight = Math.max(...columns.map(col => col.height));

        console.log("Column heights:", columns.map(c => c.height));
        console.log("Photo counts:", columns.map(c => c.photos.length));
        console.log("Column widths:", columns.map(c => c.width));

        // Adjust each column to match the max height
        columns.forEach(column => {
            if (column.photos.length === 0) return;

            const heightDifference = maxHeight - column.height;
            if (heightDifference <= 0) return; // No adjustment needed

            // Calculate total height without gaps to determine proportional adjustments
            const totalPhotoHeight = column.photos.reduce((sum, photo) => {
                return sum + (photo.sizes?.big?.height || 0);
            }, 0);

            // Calculate adjustment factor
            const adjustmentFactor = heightDifference / totalPhotoHeight;

            // Adjust each photo in the column proportionally
            const adjustedPhotos = column.photos.map(photo => {
                const height = photo.sizes?.big?.height;
                const width = photo.sizes?.big?.width;

                if (!height || !width) return photo;

                // Calculate new height with proportional adjustment
                const heightAdjustment = height * adjustmentFactor;
                const newHeight = height + heightAdjustment;

                return {
                    ...photo,
                    sizes: {
                        ...photo.sizes,
                        big: {
                            ...photo.sizes.big,
                            width: width, // Width stays the same (column width)
                            height: newHeight,
                        },
                    },
                    heightAdjustment,
                };
            });

            column.photos = adjustedPhotos;
            // Update column height
            column.height = maxHeight;
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
                <PhotoTileColumns
                    columns={columns}
                    onPhotoClick={openLightbox}
                    onPhotoDownload={onPhotoDownload}
                />
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