'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, X } from '@phosphor-icons/react';
import { type Photo, PhotoTile } from './photo-tile';

type PhotoGalleryProps = {
    photos: Photo[];
};

export function PhotoGallery({ photos }: PhotoGalleryProps) {
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);

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
                        className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors z-10"
                        aria-label="Close lightbox"
                    >
                        <X size={24} weight="bold" />
                    </button>

                    <button
                        onClick={() => navigatePhoto('prev')}
                        className="absolute left-4 text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors z-10"
                        aria-label="Previous photo"
                    >
                        <ArrowLeft size={24} weight="bold" />
                    </button>

                    <button
                        onClick={() => navigatePhoto('next')}
                        className="absolute right-4 text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors z-10"
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