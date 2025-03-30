'use client';

import Image from 'next/image';
import { useState } from 'react';

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
  };
}

type PhotoTileProps = {
  photo: Photo;
  onClick?: (photo: Photo) => void;
  aspectRatio?: string;
};

export function PhotoTile({
  photo,
  onClick,
}: PhotoTileProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleClick = () => {
    if (onClick) {
      onClick(photo);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Calculate aspect ratio from big image size
  const aspectRatioValue = photo.sizes.big.width / photo.sizes.big.height;
  const aspectRatioStyles = { aspectRatio: aspectRatioValue.toString() };

  const content = (
    <>
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
        height={photo.sizes.big.height}
        width={photo.sizes.big.width}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        className={`w-full h-auto object-cover transition-all duration-500 ${isLoading ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`}
        style={aspectRatioStyles}
        onLoad={handleImageLoad}
      />
    </>
  );

  const className = `group relative w-full overflow-hidden bg-stone-100 cursor-pointer`;

  return (
    <div
      className={className}
      onClick={handleClick}
    >
      {content}
    </div>
  );
} 