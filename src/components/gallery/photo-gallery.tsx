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
    const containerRef = useRef<HTMLDivElement>(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [initialPhotoIndex, setInitialPhotoIndex] = useState(0);

    useEffect(() => {
        if (photos.length === 0) return;

        const containerWidth = containerRef.current?.clientWidth ?? 0;
        if (containerWidth === 0) return;

        // Calculate column count based on container width
        let columnCount = 3;
        if (containerWidth < 640) {
            columnCount = 1;
        } else if (containerWidth < 768) {
            columnCount = 2;
        }

        if (containerWidth >= 1280 && photos.length >= 50) {
            columnCount = 4;
        }

        const gapSpace = GAP_SIZE * (columnCount - 1);
        const availableWidth = containerWidth - gapSpace;
        const columnWidth = Math.floor(availableWidth / columnCount);

        // 1. Calculate initial tile sizes based on column width
        const photosWithTileSizes = photos.map(photo => {
            const aspectRatio = photo.width / photo.height;
            const tileHeight = Math.round(columnWidth / aspectRatio);

            return {
                ...photo,
                sizes: {
                    ...photo.sizes,
                    tile: {
                        width: columnWidth,
                        height: tileHeight
                    }
                }
            };
        });

        // 2. Distribute photos into columns based on tile heights
        const newColumns: Column[] = Array.from({ length: columnCount }, () => ({
            photos: [],
            height: 0,
            width: columnWidth
        }));

        photosWithTileSizes.forEach(photo => {
            const minHeightColumn = newColumns.reduce(
                (min, col, i) => col.height < newColumns[min]!.height ? i : min,
                0
            );

            const gapContribution = newColumns[minHeightColumn]!.photos.length > 0 ? GAP_SIZE : 0;
            newColumns[minHeightColumn]!.photos.push(photo);
            newColumns[minHeightColumn]!.height += photo.sizes.tile.height + gapContribution;
        });

        // 3. Find the tallest column
        const maxColumnHeight = Math.max(...newColumns.map(col => col.height));

        // 4 & 5. Adjust heights of shorter columns to match the tallest
        newColumns.forEach(column => {
            if (column.height === maxColumnHeight) return;

            const totalGaps = (column.photos.length - 1) * GAP_SIZE;
            const availableHeight = maxColumnHeight - totalGaps;
            const totalPhotoHeight = column.photos.reduce((sum, photo) => sum + photo.sizes.tile.height, 0);
            const scaleRatio = availableHeight / totalPhotoHeight;

            // Adjust each photo's height proportionally
            column.photos = column.photos.map(photo => {
                const newHeight = Math.round(photo.sizes.tile.height * scaleRatio);

                return {
                    ...photo,
                    sizes: {
                        ...photo.sizes,
                        tile: {
                            width: columnWidth,
                            height: newHeight
                        }
                    }
                };
            });

            // Recalculate column height with new rounded heights
            const newColumnHeight = column.photos.reduce((sum, photo) => sum + photo.sizes.tile.height, 0) + 
                                  ((column.photos.length - 1) * GAP_SIZE);
            
            // If there are remaining pixels to distribute
            if (newColumnHeight < maxColumnHeight) {
                const remainingPixels = maxColumnHeight - newColumnHeight;
                const photosToAdjust = column.photos.length;
                let currentHeight = newColumnHeight;
                let currentPhotoIndex = 0;

                // Keep distributing pixels until we reach the target height
                while (currentHeight < maxColumnHeight) {
                    const photo = column.photos[currentPhotoIndex];
                    if (!photo) continue;

                    column.photos[currentPhotoIndex] = {
                        ...photo,
                        sizes: {
                            ...photo.sizes,
                            tile: {
                                ...photo.sizes.tile,
                                height: photo.sizes.tile.height + 1
                            }
                        }
                    };

                    currentHeight += 1;
                    currentPhotoIndex = (currentPhotoIndex + 1) % photosToAdjust;
                }
            }

            column.height = maxColumnHeight;
        });

        setColumns(newColumns);
    }, [photos]);

    // Handle window resize
    useEffect(() => {
        const handleResize = debounce(() => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                if (containerWidth > 0) {
                    setColumns([]); // Trigger re-render with new column count
                }
            }
        }, 250);

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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