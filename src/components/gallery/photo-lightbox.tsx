'use client';

import { ArrowLeft, ArrowRight, X, File } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { type Photo } from './photo-tile';
import { strings } from '../../resources';
import { PhotoDownloadButton } from './photo-download-button';
import { getFilenameFromUrl } from '../../lib/file';
import Image from 'next/image';

type LightboxProps = {
    photos: Photo[];
    initialPhotoIndex?: number;
    isOpen: boolean;
    onClose: () => void;
    onPhotoDownload?: (photo: Photo) => void;
};

// Delay before showing loading indicator or starting animations (ms)
const LOADING_DELAY = 300;

// Component to display the filename chip
function PhotoFilenameChip({ filename, url }: { filename?: string; url: string }) {
    const displayFilename = filename || getFilenameFromUrl(url);
    
    if (!displayFilename) return null;

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 text-white">
            <File size={16} weight="bold" className="text-inherit" />
            <span className="text-xs text-inherit truncate max-w-48">{displayFilename}</span>
        </div>
    );
}

export function PhotoLightbox({
    photos,
    initialPhotoIndex = 0,
    isOpen,
    onClose,
    onPhotoDownload
}: LightboxProps) {
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(initialPhotoIndex);
    const [lightboxVisible, setLightboxVisible] = useState(false);
    const [lightboxLoading, setLightboxLoading] = useState(false);
    const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
    const [skipAnimation, setSkipAnimation] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);
    const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);
    const loadingStartTimeRef = useRef<number>(0);
    const lightboxRef = useRef<HTMLDivElement>(null);

    // Get the currently selected photo
    const selectedPhoto = photos[selectedPhotoIndex];

    // Initialize the lightbox when it opens
    useEffect(() => {
        if (isOpen) {
            // Set initial state
            setSelectedPhotoIndex(initialPhotoIndex);
            setLightboxVisible(false);
            setShowImage(false);
            document.body.style.overflow = 'hidden';

            // Trigger the entrance animation
            requestAnimationFrame(() => {
                setLightboxVisible(true);
            });

            startLoadingTimer();
        }
    }, [isOpen, initialPhotoIndex]);

    const startLoadingTimer = () => {
        // Clear any existing timer
        if (loadingTimerRef.current) {
            clearTimeout(loadingTimerRef.current);
            loadingTimerRef.current = null;
        }

        // Set loading state
        setLightboxLoading(true);
        setShowLoadingIndicator(false);
        setSkipAnimation(false);
        setShowImage(false);

        // Record start time
        loadingStartTimeRef.current = Date.now();

        // Only show loading indicator if loading takes more than LOADING_DELAY
        loadingTimerRef.current = setTimeout(() => {
            setShowLoadingIndicator(true);
        }, LOADING_DELAY);
    };

    const handleImageLoaded = () => {
        // Calculate how long the image took to load
        const loadTime = Date.now() - loadingStartTimeRef.current;

        // Clear the timer if it exists
        if (loadingTimerRef.current) {
            clearTimeout(loadingTimerRef.current);
            loadingTimerRef.current = null;
        }

        // If the image loaded quickly (< LOADING_DELAY), skip all animations
        if (loadTime < LOADING_DELAY) {
            setSkipAnimation(true);
            setShowLoadingIndicator(false);
            setLightboxLoading(false);
            setShowImage(true);
        } else {
            // If loading took longer, keep the indicator visible briefly before fading out
            setLightboxLoading(false);

            // Start the transition animation
            setShowImage(true);

            // Hide the loading indicator after a short delay
            setTimeout(() => {
                setShowLoadingIndicator(false);
            }, 100); // Short delay to allow for a smooth transition
        }
    };

    const closeLightbox = () => {
        // Start exit animation
        setLightboxVisible(false);
        setShowImage(false);

        // Wait for animation to complete before removing from DOM
        setTimeout(() => {
            onClose();
            document.body.style.overflow = 'auto';
        }, 300);

        // Clear any pending timers when closing
        if (loadingTimerRef.current) {
            clearTimeout(loadingTimerRef.current);
            loadingTimerRef.current = null;
        }
    };

    const navigatePhoto = (direction: 'next' | 'prev') => {
        let newIndex;

        if (direction === 'next') {
            newIndex = (selectedPhotoIndex + 1) % photos.length;
        } else {
            newIndex = (selectedPhotoIndex - 1 + photos.length) % photos.length;
        }

        startLoadingTimer();
        setSelectedPhotoIndex(newIndex);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
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

    // Clean up any timers when component unmounts
    useEffect(() => {
        return () => {
            if (loadingTimerRef.current) {
                clearTimeout(loadingTimerRef.current);
            }
        };
    }, []);

    const handleDownload = (e: React.MouseEvent, photo: Photo) => {
        // Call the callback if provided
        if (onPhotoDownload) {
            // If the callback is provided, we might want to let the parent component
            // handle the download logic, so prevent the default anchor behavior
            e.preventDefault();
            onPhotoDownload(photo);
        }
        // If no callback is provided, the default anchor behavior will proceed
    };

    if (!isOpen || !selectedPhoto) return null;

    const nextIndex = (selectedPhotoIndex + 1) % photos.length;
    const prevIndex = (selectedPhotoIndex - 1 + photos.length) % photos.length;
    const nextPhoto = photos[nextIndex];
    const prevPhoto = photos[prevIndex];

    return (
        <div
            ref={lightboxRef}
            className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ease-in-out ${lightboxVisible ? 'bg-black/95' : 'bg-black/0'}`}
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            {/* Hidden preload images */}
            {nextPhoto && (
                <div className="hidden absolute inset-0">
                    <Image
                        src={nextPhoto.sizes?.big?.url || nextPhoto.url}
                        alt=""
                        fill
                        sizes="100vw"
                        priority
                    />
                </div>
            )}
            {prevPhoto && (
                <div className="hidden absolute inset-0">
                    <Image
                        src={prevPhoto.sizes?.big?.url || prevPhoto.url}
                        alt=""
                        fill
                        sizes="100vw"
                        priority
                    />
                </div>
            )}

            <div className={`absolute top-4 right-4 flex items-center space-x-2 z-10 transition-opacity duration-300 ${lightboxVisible ? 'opacity-100' : 'opacity-0'}`}>
                <PhotoFilenameChip 
                    filename={selectedPhoto.filename} 
                    url={selectedPhoto.sizes?.big?.url || selectedPhoto.url} 
                />
                
                {onPhotoDownload && (
                    <PhotoDownloadButton
                        url={selectedPhoto.sizes?.big?.url || selectedPhoto.url}
                        onDownload={(e) => handleDownload(e, selectedPhoto)}
                        className="bg-black/20 hover:bg-black/40"
                        variant="dark"
                    />
                )}

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
                className={`absolute cursor-pointer left-4 text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-all duration-300 z-10 ${lightboxVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                aria-label="Previous photo"
            >
                <ArrowLeft size={24} weight="bold" />
            </button>

            <button
                onClick={() => navigatePhoto('next')}
                className={`absolute cursor-pointer right-4 text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-all duration-300 z-10 ${lightboxVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
                aria-label="Next photo"
            >
                <ArrowRight size={24} weight="bold" />
            </button>

            <div className={`relative w-full h-full flex items-center justify-center transition-transform duration-300 ${lightboxVisible ? 'scale-100' : 'scale-95'}`}>
                {/* Subtle spinner - only shown if loading takes more than LOADING_DELAY */}
                {showLoadingIndicator && (
                    <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 z-10">
                        <div className="spinner"></div>
                    </div>
                )}

                <div className={`relative w-full h-full ${skipAnimation ? '' : 'transition-opacity duration-500'} ${showImage ? 'opacity-100' : 'opacity-0'}`}>
                    <Image
                        ref={imageRef}
                        src={selectedPhoto.sizes?.big?.url || selectedPhoto.url}
                        alt={selectedPhoto.alt}
                        fill
                        sizes="100vw"
                        className={`object-contain ${skipAnimation ? '' : 'transition-transform duration-500'} ${showImage ? 'scale-100' : 'scale-[0.98]'}`}
                        onLoadingComplete={handleImageLoaded}
                        priority
                    />
                </div>
            </div>
        </div>
    );
} 