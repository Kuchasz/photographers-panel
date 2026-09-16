'use client';

import { useWindowVirtualizer } from '@tanstack/react-virtual';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { type Photo, PhotoTile } from './photo-tile';
import { PhotoLightbox } from './photo-lightbox';
import { calculateGridLayout, GAP_SIZE, type GridLayout } from '~/lib/grid';

type PhotoGalleryProps = {
    photos: Photo[];
    onPhotoDownload?: (photo: Photo) => void;
};

const MemoizedPhotoTile = React.memo(PhotoTile);

export function PhotoGallery({
    photos,
    onPhotoDownload
}: PhotoGalleryProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [scrollMargin, setScrollMargin] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [initialPhotoIndex, setInitialPhotoIndex] = useState(0);

    // Track the container width only. iOS Safari fires `resize` while
    // scrolling (URL bar collapsing) but the width does not change, so the
    // layout stays untouched in that case.
    useLayoutEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        let frame = 0;
        const update = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const width = Math.floor(element.clientWidth);
                setContainerWidth(prev => (prev === width ? prev : width));
                setScrollMargin(element.getBoundingClientRect().top + window.scrollY);
            });
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(element);
        return () => {
            observer.disconnect();
            cancelAnimationFrame(frame);
        };
    }, []);

    const layout: GridLayout | null = useMemo(
        () => calculateGridLayout(photos, containerWidth),
        [photos, containerWidth]
    );

    const columnCount = layout?.columnCount ?? 1;
    const heights = layout?.heights;

    const virtualizer = useWindowVirtualizer({
        count: layout ? photos.length : 0,
        lanes: columnCount,
        gap: GAP_SIZE,
        scrollMargin,
        // Heights are known exactly, so no DOM measurement is needed.
        estimateSize: index => heights?.[index] ?? 0,
        getItemKey: index => photos[index]?.id ?? index,
        // Keep roughly two extra screens of tiles mounted so fast flicks on
        // mobile do not show empty space, while the DOM stays small.
        overscan: columnCount * 6,
    });

    // Column count / heights changed (resize) - make the virtualizer forget cached sizes.
    useEffect(() => {
        virtualizer.measure();
    }, [virtualizer, layout]);

    const openLightbox = useCallback((photo: Photo) => {
        const photoIndex = photos.findIndex(p => p.id === photo.id);
        if (photoIndex !== -1) {
            setInitialPhotoIndex(photoIndex);
            setLightboxOpen(true);
        }
    }, [photos]);

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const scrollToPhoto = useCallback((photoIndex: number) => {
        if (photoIndex < 0 || photoIndex >= photos.length) return;
        virtualizer.scrollToIndex(photoIndex, { align: 'center', behavior: 'smooth' });
    }, [photos.length, virtualizer]);

    const virtualItems = virtualizer.getVirtualItems();

    return (
        <div className="space-y-8">
            <div
                ref={containerRef}
                className="relative w-full"
                style={{ height: layout ? `${virtualizer.getTotalSize()}px` : undefined }}
            >
                {layout && virtualItems.map(item => {
                    const photo = photos[item.index];
                    if (!photo) return null;

                    return (
                        <MemoizedPhotoTile
                            key={item.key}
                            photo={photo}
                            height={item.size}
                            onClick={openLightbox}
                            onPhotoDownload={onPhotoDownload}
                            className="absolute top-0 left-0"
                            style={{
                                width: `${layout.columnWidth}px`,
                                transform: `translateY(${item.start - scrollMargin}px)`,
                                left: `${item.lane * (layout.columnWidth + GAP_SIZE)}px`,
                            }}
                        />
                    );
                })}
            </div>

            <PhotoLightbox
                photos={photos}
                initialPhotoIndex={initialPhotoIndex}
                isOpen={lightboxOpen}
                onClose={closeLightbox}
                onPhotoDownload={onPhotoDownload}
                onPhotoChange={scrollToPhoto}
            />
        </div>
    );
}
