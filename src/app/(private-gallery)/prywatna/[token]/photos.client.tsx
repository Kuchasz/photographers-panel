'use client';

import { PhotoGallery, type Photo } from "~/components/gallery";
import { downloadPhotoWithCors, getPhotos } from "./actions";
import { saveBlobAsDownload } from "~/lib/file";
import { strings } from "~/resources";
import { useState, useEffect } from "react";

type PhotoGalleryProps = {
    token: string;
}

export const PhotosClient = ({ token }: PhotoGalleryProps) => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPhotos = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const photosData = await getPhotos(token);

                if (!photosData) {
                    setError(strings.privateGallery.unavailable);
                    return;
                }

                setPhotos(photosData.photos);
            } catch (err) {
                console.error('Error loading photos:', err);
                setError(strings.privateGallery.unavailable);
            } finally {
                setIsLoading(false);
            }
        };

        loadPhotos();
    }, [token]);

    const handleDownload = async (photo: Photo) => {
        try {
            const imageUrl = photo.sizes?.big?.url || photo.url;
            const result = await downloadPhotoWithCors(imageUrl, token);
            if (result.error) throw new Error(result.error);
            if (!result.blob || !result.filename) throw new Error('Missing blob or filename');
            saveBlobAsDownload(result.blob, result.filename);
        } catch (error) {
            console.error('Error during photo download:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="py-16 text-center">
                <div className="inline-flex flex-col items-center space-y-4">
                    {/* Animated loading spinner */}
                    <div className="relative">
                        <div className="w-12 h-12 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-gold-300 rounded-full animate-ping"></div>
                    </div>

                    {/* Loading text with dots animation */}
                    <div className="flex items-center space-x-2">
                        <span className="text-lg text-stone-600">Ładowanie zdjęć</span>
                        <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-gold-500 rounded-full animate-bounce"></div>
                            <div className="w-1 h-1 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1 h-1 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-12 text-center">
                <div className="inline-flex flex-col items-center space-y-4">
                    {/* Error icon */}
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>

                    <p className="text-lg text-red-600 font-medium">
                        {error}
                    </p>

                    <p className="text-sm text-stone-500">
                        Sprawdź czy galeria jest dostępna lub skontaktuj się z Parą Młodą
                    </p>
                </div>
            </div>
        );
    }

    if (photos.length === 0) {
        return (
            <div className="py-12 text-center">
                <div className="inline-flex flex-col items-center space-y-4">
                    {/* Empty state icon */}
                    <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>

                    <p className="text-lg text-stone-600">
                        {strings.privateGallery.unavailable}
                    </p>

                    <p className="text-sm text-stone-500">
                        Galeria nie zawiera żadnych zdjęć
                    </p>
                </div>
            </div>
        );
    }

    return (
        <PhotoGallery photos={photos} onPhotoDownload={handleDownload} />
    );
}