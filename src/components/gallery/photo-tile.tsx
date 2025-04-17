'use client';

import Image from 'next/image';
import { useState } from 'react';
import { PhotoDownloadButton } from './photo-download-button';
import { strings } from '../../resources';

export type Photo = {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
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
    tile: {
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

export function PhotoTile({
  photo,
  onClick,
  onPhotoDownload,
}: PhotoTileProps) {
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
      className="group relative overflow-hidden bg-stone-100 cursor-pointer transition-all duration-300 ease-out hover:z-10 rounded-lg"
      onClick={handleClick}
    >
      <div className="relative w-full flex items-center justify-center scale-105 transition-transform duration-300 ease-out group-hover:scale-100">
        {/* Enhanced skeleton loader with shimmer effect */}
        <div
          className={`absolute inset-0 overflow-hidden transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-50/30 to-transparent animate-shimmer" />
        </div>

        <Image
          src={photo.url}
          alt={photo.alt}
          height={photo.sizes.tile.height}
          width={photo.sizes.tile.width}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className={`w-full h-auto object-cover transition-all duration-500 ${isLoading ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`}
          style={{
            aspectRatio: `${photo.sizes.tile.width} / ${photo.sizes.tile.height}`
          }}
          onLoad={handleImageLoad}
        />

        {/* Dark overlay and download button */}
        {onPhotoDownload && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
            <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <PhotoDownloadButton
                url={photo.sizes?.big?.url || photo.url}
                onDownload={handleDownload}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 