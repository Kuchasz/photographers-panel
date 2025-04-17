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
                    className="flex-1 flex flex-col gap-2 min-w-0"
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

const MemoizedPhotoTile = React.memo(PhotoTile, (prevProps, nextProps) => {
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

    useEffect(() => {
        const updateColumnCount = () => {
            const width = window.innerWidth;
            let columns;
            if (width < 640) {
                columns = 1;
            } else if (width < 768) {
                columns = 2;
            } else {
                columns = 3;
            }

            if (width >= 1280 && photos.length >= 50) {
                columns = 4;
            }

            setColumnCount(columns);
        };

        const debouncedUpdateColumnCount = debounce(updateColumnCount, 250);

        updateColumnCount();
        window.addEventListener('resize', debouncedUpdateColumnCount);
        return () => window.removeEventListener('resize', debouncedUpdateColumnCount);
    }, [photos.length]);

    useEffect(() => {
        if (photos.length === 0 || columnCount === 0) return;

        const containerWidth = containerRef.current?.clientWidth ?? 0;
        if (containerWidth === 0) return;

        const gapSpace = GAP_SIZE * (columnCount - 1);
        const availableWidth = containerWidth - gapSpace;
        const columnWidth = Math.floor(availableWidth / columnCount);

        console.log('Container dimensions:', {
            containerWidth,
            gapSpace,
            availableWidth,
            columnWidth,
            columnCount
        });

        // First calculate scaled dimensions for all photos
        const processedPhotos = photos.map(photo => {
            const originalWidth = photo.sizes.big.width;
            const originalHeight = photo.sizes.big.height;
            const originalAspectRatio = originalWidth / originalHeight;

            // Scale photo to fit column width, but don't upscale if original is smaller
            let scaledWidth = columnWidth;
            let scaledHeight;

            if (originalWidth <= columnWidth) {
                // If original is smaller than column, keep original size
                scaledWidth = originalWidth;
                scaledHeight = originalHeight;
            } else {
                // Scale down to fit column
                scaledWidth = columnWidth;
                scaledHeight = Math.floor(columnWidth / originalAspectRatio);
            }

            console.log('Photo scaling:', {
                id: photo.id,
                original: { width: originalWidth, height: originalHeight },
                scaled: { width: scaledWidth, height: scaledHeight }
            });

            return {
                photo,
                scaledWidth,
                scaledHeight,
                aspectRatio: originalAspectRatio
            };
        });

        // Sort photos by scaled height to help with distribution
        processedPhotos.sort((a, b) => b.scaledHeight - a.scaledHeight);

        // Distribute photos to columns
        const newColumns: Column[] = Array.from({ length: columnCount }, () => ({
            photos: [],
            height: 0,
            width: 0
        }));

        processedPhotos.forEach(({ photo, scaledWidth, scaledHeight }) => {
            const minHeightColumn = newColumns.reduce(
                (min, col, i) => col.height < newColumns[min]!.height ? i : min,
                0
            );

            const gapContribution = newColumns[minHeightColumn]!.photos.length > 0 ? GAP_SIZE : 0;

            const adjustedPhoto = {
                ...photo,
                sizes: {
                    ...photo.sizes,
                    big: {
                        ...photo.sizes.big,
                        width: scaledWidth,
                        height: scaledHeight,
                    }
                }
            };

            newColumns[minHeightColumn]!.photos.push(adjustedPhoto);
            newColumns[minHeightColumn]!.height += scaledHeight + gapContribution;
            newColumns[minHeightColumn]!.width = columnWidth;
        });

        // Scale photos in shorter columns to match the tallest
        const maxColumnHeight = Math.max(...newColumns.map(col => col.height));
        console.log('Column heights before scaling:', newColumns.map(col => Math.round(col.height)));

        newColumns.forEach((column, index) => {
            if (column.photos.length === 0 || column.height === maxColumnHeight) return;

            const totalGaps = (column.photos.length - 1) * GAP_SIZE;
            const availableHeight = maxColumnHeight - totalGaps;
            const totalPhotoHeight = column.photos.reduce((sum, photo) => sum + photo.sizes.big.height, 0);
            
            // Scale each photo proportionally
            column.photos = column.photos.map(photo => {
                const scaleRatio = availableHeight / totalPhotoHeight;
                const newHeight = Math.floor(photo.sizes.big.height * scaleRatio);

                return {
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
            });

            column.height = maxColumnHeight;
        });

        console.log('Final column heights:', newColumns.map(col => Math.round(col.height)));

        setColumns(newColumns);
    }, [photos, columnCount]);

    const openLightbox = (photo: Photo) => {
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
            <div className="flex flex-wrap gap-2" ref={containerRef}>
                <PhotoTileColumns
                    columns={columns}
                    onPhotoClick={openLightbox}
                    onPhotoDownload={onPhotoDownload}
                />
            </div>

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