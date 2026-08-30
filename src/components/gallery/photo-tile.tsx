'use client';

import Image from 'next/image';
import { forwardRef, useState } from 'react';
import { PhotoDownloadButton } from './photo-download-button';

export type Photo = {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  filename?: string;
  downloadUrl?: string;
  sizes: {
    thumbnail: {
      url: string;
      width: number;
      height: number;
    };
    big: {
      url: string;
      width: number;
      height: number;
    };
    tile?: {
      width: number;
      height: number;
    };
  };
}

type PhotoTileProps = {
  photo: Photo;
  onClick?: (photo: Photo) => void;
  onPhotoDownload?: (photo: Photo) => void;
  aspectRatio?: string;
};

export const PhotoTile = forwardRef<HTMLDivElement, PhotoTileProps>(function PhotoTile({
  photo,
  onClick,
  onPhotoDownload,
}, ref) {
  const [isLoading, setIsLoading] = useState(true);

  const handleClick = () => {
    if (onClick) {
      onClick(photo);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the photo click
    if (onPhotoDownload) {
      onPhotoDownload(photo);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden bg-stone-100 cursor-pointer transition-all duration-300 ease-out hover:z-10"
      onClick={handleClick}
    >
      <div 
        className="relative w-full flex items-center justify-center scale-105 transition-transform will-change-transform duration-300 ease-out group-hover:scale-100"
        style={{ height: `${Math.round(photo.sizes.tile?.height ?? 0)}px` }}
      >
        {/* Enhanced skeleton loader with shimmer effect */}
        <div
          className={`absolute inset-0 overflow-hidden transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-50/30 to-transparent animate-shimmer" />
        </div>

        <Image
          src={photo.sizes.thumbnail.url || photo.url}
          alt={photo.alt}
          height={photo.sizes.thumbnail.height}
          width={photo.sizes.thumbnail.width}
          unoptimized
          className={`w-full h-full object-cover transition-all duration-500 ${isLoading ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`}
          onLoad={handleImageLoad}
        />

        {/* Dark overlay and download button */}
        {onPhotoDownload && (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent via-[20%] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></div>
            <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <PhotoDownloadButton
                url={photo.downloadUrl || photo.sizes?.big?.url || photo.url}
                onDownload={handleDownload}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
