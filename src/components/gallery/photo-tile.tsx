'use client';

import Image from 'next/image';
import { forwardRef, useEffect, useRef, useState } from 'react';
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
  };
}

type PhotoTileProps = {
  photo: Photo;
  /** Rendered tile height in px (computed by the grid layout). */
  height: number;
  onClick?: (photo: Photo) => void;
  onPhotoDownload?: (photo: Photo) => void;
  className?: string;
  style?: React.CSSProperties;
};

export const PhotoTile = forwardRef<HTMLDivElement, PhotoTileProps>(function PhotoTile({
  photo,
  height,
  onClick,
  onPhotoDownload,
  className = '',
  style,
}, ref) {
  const [isLoading, setIsLoading] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);

  // Virtualized tiles get remounted while scrolling; when the thumbnail is
  // already in the browser cache `onLoad` may not fire, so check `complete`.
  useEffect(() => {
    if (imageRef.current?.complete && imageRef.current.naturalWidth > 0) {
      setIsLoading(false);
    }
  }, []);

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
      className={`group overflow-hidden bg-stone-100 cursor-pointer hover:z-10 ${className}`}
      style={style}
      onClick={handleClick}
    >
      {/* The subtle zoom-out on hover only exists on devices with a pointer;
          on touch devices we avoid transforms entirely so tiles do not become
          separate compositing layers (a memory problem on iOS Safari). */}
      <div
        className="relative w-full flex items-center justify-center transition-transform duration-300 ease-out [@media(hover:hover)]:scale-105 group-hover:scale-100"
        style={{ height: `${Math.round(height)}px` }}
      >
        {/* Skeleton loader - unmounted once the image is loaded so its
            infinite animations stop running for every tile on the page */}
        {isLoading && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-50/30 to-transparent animate-shimmer" />
          </div>
        )}

        <Image
          ref={imageRef}
          src={photo.sizes.thumbnail.url || photo.url}
          alt={photo.alt}
          height={photo.sizes.thumbnail.height}
          width={photo.sizes.thumbnail.width}
          unoptimized
          decoding="async"
          draggable={false}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
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
