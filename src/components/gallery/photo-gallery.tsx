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

        // First distribute photos based on their original dimensions
        const newColumns: Column[] = Array.from({ length: columnCount }, () => ({
            photos: [],
            height: 0,
            width: columnWidth
        }));

        // Distribute photos based on original dimensions
        photos.forEach(photo => {
            const minHeightColumn = newColumns.reduce(
                (min, col, i) => col.height < newColumns[min]!.height ? i : min,
                0
            );

            const gapContribution = newColumns[minHeightColumn]!.photos.length > 0 ? GAP_SIZE : 0;
            const aspectRatio = photo.width / photo.height;
            const originalHeight = columnWidth / aspectRatio;

            newColumns[minHeightColumn]!.photos.push(photo);
            newColumns[minHeightColumn]!.height += originalHeight + gapContribution;
        });

        // Now adjust the sizes of photos in each column without redistributing
        newColumns.forEach(column => {
            column.photos = column.photos.map(photo => {
                const aspectRatio = photo.width / photo.height;
                const scaledHeight = Math.floor(columnWidth / aspectRatio);

                return {
                    ...photo,
                    sizes: {
                        ...photo.sizes,
                        tile: {
                            width: columnWidth,
                            height: scaledHeight
                        }
                    }
                };
            });
        });

        console.log(newColumns.map(c => c.photos.map(p => p.sizes.tile.height)));

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