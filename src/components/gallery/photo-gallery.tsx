'use client';

import { useEffect, useRef, useState } from 'react';
import { type Photo, PhotoTile } from './photo-tile';
import React from 'react';
import { PhotoLightbox } from './photo-lightbox';
import { debounce } from '~/lib/function';
import { calculateGridLayout } from '~/lib/grid';

type PhotoGalleryProps = {
    photos: Photo[];
    onPhotoDownload?: (photo: Photo) => void;
};

const PhotoTileColumns = React.memo(({
    columns,
    onPhotoClick,
    onPhotoDownload
}: {
    columns: ReturnType<typeof calculateGridLayout>;
    onPhotoClick: (photo: Photo) => void;
    onPhotoDownload?: (photo: Photo) => void;
}) => {
    return (
        <>
            {columns.map((column, columnIndex) => (
                <div
                    key={`column-${columnIndex}`}
                    className="flex-1 flex flex-col gap-1.5 min-w-0"
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
    return prevProps.photo.id === nextProps.photo.id && prevProps.photo.sizes.tile!.height === nextProps.photo.sizes.tile!.height;
});
MemoizedPhotoTile.displayName = 'MemoizedPhotoTile';

export function PhotoGallery({
    photos,
    onPhotoDownload
}: PhotoGalleryProps) {
    const [columns, setColumns] = useState<ReturnType<typeof calculateGridLayout>>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [initialPhotoIndex, setInitialPhotoIndex] = useState(0);

    useEffect(() => {
        const calculateAndSetColumns = () => {
            if (photos.length === 0) return;

            const containerWidth = containerRef.current?.clientWidth ?? 0;
            if (containerWidth === 0) return;

            const newColumns = calculateGridLayout(photos, containerWidth);
            setColumns(newColumns);
        };

        // Initial calculation
        calculateAndSetColumns();

        // Handle window resize
        const handleResize = debounce(calculateAndSetColumns, 1000);
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [photos]);

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
            <div className="flex flex-wrap gap-1.5" ref={containerRef}>
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