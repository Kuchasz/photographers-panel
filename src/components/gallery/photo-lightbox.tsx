'use client';

import { ArrowLeft, ArrowRight, File, X } from '@phosphor-icons/react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { getFilenameFromUrl } from '../../lib/file';
import { PhotoDownloadButton } from './photo-download-button';
import { type Photo } from './photo-tile';

type LightboxProps = {
    photos: Photo[];
    initialPhotoIndex?: number;
    isOpen: boolean;
    onClose: () => void;
    onPhotoDownload?: (photo: Photo) => void;
    onPhotoChange?: (photoIndex: number) => void;
};

// Delay before showing loading indicator or starting animations (ms)
const LOADING_DELAY = 250;

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
    onPhotoDownload,
    onPhotoChange
}: LightboxProps) {
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(initialPhotoIndex);
    const [lightboxVisible, setLightboxVisible] = useState(false);
    const [lightboxLoading, setLightboxLoading] = useState(false);
    const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
    const [skipAnimation, setSkipAnimation] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);
    const loadingStartTimeRef = useRef<number>(0);
    const lightboxRef = useRef<HTMLDivElement>(null);
    
    // Touch handling state
    const touchStartX = useRef<number>(0);
    const touchStartY = useRef<number>(0);
    const touchStartTime = useRef<number>(0);
    const initialPinchDistance = useRef<number>(0);
    const isPinching = useRef<boolean>(false);

    // Get the currently selected photo
    // Use initialPhotoIndex when lightbox is first opening (before visible) to prevent flashing old photo
    const currentPhotoIndex = (!lightboxVisible && isOpen) 
        ? initialPhotoIndex 
        : selectedPhotoIndex;
    const selectedPhoto = photos[currentPhotoIndex];

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

            // Focus the lightbox to enable keyboard navigation
            setTimeout(() => {
                lightboxRef.current?.focus();
            }, 0);
        } else {
            // Reset state when closing to prevent flashing old photo on next open
            setShowImage(false);
            setLightboxVisible(false);
        }
    }, [isOpen, initialPhotoIndex]);

    // Notify parent when photo changes (for scrolling in background grid)
    useEffect(() => {
        if (isOpen && lightboxVisible && onPhotoChange) {
            onPhotoChange(selectedPhotoIndex);
        }
    }, [selectedPhotoIndex, isOpen, lightboxVisible, onPhotoChange]);

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
        // Don't hide the image immediately - let the opacity animation complete

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
            setSlideDirection('left');
        } else {
            newIndex = (selectedPhotoIndex - 1 + photos.length) % photos.length;
            setSlideDirection('right');
        }

        startLoadingTimer();
        setSelectedPhotoIndex(newIndex);
    };

    // Calculate distance between two touch points (for pinch detection)
    const getTouchDistance = (touches: React.TouchList) => {
        if (touches.length < 2) return 0;
        const dx = (touches[0]?.clientX ?? 0) - (touches[1]?.clientX ?? 0);
        const dy = (touches[0]?.clientY ?? 0) - (touches[1]?.clientY ?? 0);
        return Math.sqrt(dx * dx + dy * dy);
    };

    // Handle touch start
    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            // Pinch gesture started
            isPinching.current = true;
            initialPinchDistance.current = getTouchDistance(e.touches);
            // Prevent default to stop iOS Safari zoom
            e.preventDefault();
        } else if (e.touches.length === 1) {
            // Single touch for swipe
            isPinching.current = false;
            touchStartX.current = e.touches[0]?.clientX ?? 0;
            touchStartY.current = e.touches[0]?.clientY ?? 0;
            touchStartTime.current = Date.now();
        }
    };

    // Handle touch move
    const handleTouchMove = (e: React.TouchEvent) => {
        if (isPinching.current && e.touches.length === 2) {
            // Prevent default zoom behavior on iOS Safari
            e.preventDefault();
        }
    };

    // Handle touch end
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (isPinching.current) {
            // Reset pinch state
            isPinching.current = false;
            initialPinchDistance.current = 0;
            return;
        }

        // Check if this was a swipe gesture
        const touchEndX = e.changedTouches[0]?.clientX ?? 0;
        const touchEndY = e.changedTouches[0]?.clientY ?? 0;
        const touchEndTime = Date.now();

        const deltaX = touchEndX - touchStartX.current;
        const deltaY = touchEndY - touchStartY.current;
        const deltaTime = touchEndTime - touchStartTime.current;

        // Calculate swipe velocity and direction
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        const velocity = absDeltaX / deltaTime;

        // Swipe thresholds
        const MIN_SWIPE_DISTANCE = 50; // Minimum distance in pixels
        const MIN_VELOCITY = 0.3; // Minimum velocity (px/ms)
        const MAX_TIME = 300; // Maximum time for a swipe (ms)

        // Check if this is a horizontal swipe
        const isHorizontalSwipe = absDeltaX > absDeltaY && absDeltaX > MIN_SWIPE_DISTANCE;
        const isFastEnough = velocity > MIN_VELOCITY || deltaTime < MAX_TIME;

        if (isHorizontalSwipe && isFastEnough) {
            // Prevent default to stop any iOS Safari gestures
            e.preventDefault();

            if (deltaX > 0) {
                // Swiped right - show previous photo
                navigatePhoto('prev');
            } else {
                // Swiped left - show next photo
                navigatePhoto('next');
            }
        }

        // Reset touch state
        touchStartX.current = 0;
        touchStartY.current = 0;
        touchStartTime.current = 0;
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

    // Preload adjacent photos for smoother navigation
    const getAdjacentPhotos = () => {
        const adjacentIndices = [];
        for (let offset = -2; offset <= 2; offset++) {
            if (offset !== 0) {
                const index = (currentPhotoIndex + offset + photos.length) % photos.length;
                adjacentIndices.push(index);
            }
        }
        return adjacentIndices.map(index => photos[index]).filter(Boolean);
    };

    const adjacentPhotos = getAdjacentPhotos();

    return (
        <div
            ref={lightboxRef}
            className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ease-in-out ${lightboxVisible ? 'bg-black/95' : 'bg-black/0'}`}
            onKeyDown={handleKeyDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            tabIndex={0}
            style={{ touchAction: 'none' }}
        >
            {/* Hidden preload images for adjacent photos - only load after current photo is ready */}
            {showImage && adjacentPhotos.map((photo, idx) => photo && (
                <div key={`preload-${photo.id}-${idx}`} className="hidden absolute inset-0">
                    <Image
                        src={photo.sizes?.big?.url || photo.url}
                        alt=""
                        fill
                        unoptimized
                        priority={false} // Don't prioritize preloads
                    />
                </div>
            ))}

            <div className={`absolute top-4 right-4 flex items-center space-x-2 z-10 transition-opacity duration-300 ${lightboxVisible ? 'opacity-100' : 'opacity-0'}`}>
                <PhotoFilenameChip 
                    filename={selectedPhoto.filename} 
                    url={selectedPhoto.downloadUrl || selectedPhoto.sizes?.big?.url || selectedPhoto.url}
                />
                
                {onPhotoDownload && (
                    <PhotoDownloadButton
                        url={selectedPhoto.downloadUrl || selectedPhoto.sizes?.big?.url || selectedPhoto.url}
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

                <div className={`relative w-full h-full transition-opacity duration-300 ${lightboxVisible ? 'opacity-100' : 'opacity-0'}`}>
                    {showImage && (
                        <Image
                            ref={imageRef}
                            src={selectedPhoto.sizes?.big?.url || selectedPhoto.url}
                            alt={selectedPhoto.alt}
                            fill
                            unoptimized
                            className="object-contain"
                            onLoadingComplete={handleImageLoaded}
                            priority
                        />
                    )}
                    {/* Hidden image for loading detection */}
                    {!showImage && (
                        <Image
                            src={selectedPhoto.sizes?.big?.url || selectedPhoto.url}
                            alt=""
                            fill
                            unoptimized
                            className="object-contain opacity-0"
                            onLoadingComplete={handleImageLoaded}
                            priority
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
