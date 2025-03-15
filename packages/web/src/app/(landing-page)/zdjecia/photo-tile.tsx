'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
  showCaption?: boolean;
  linkToPage?: boolean;
};

export function PhotoTile({
  photo,
  onClick,
  aspectRatio = '',//'aspect-[3/4]',
  showCaption = true,
  linkToPage = false,
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

  const aspectRatioStyles = { aspectRatio: `${photo.width}/${photo.height}` };

  const content = (
    <>
      {/* Enhanced skeleton loader with shimmer effect */}
      <div 
        className={`absolute inset-0 overflow-hidden rounded-lg transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
        style={aspectRatioStyles}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-50/30 to-transparent animate-shimmer" />
      </div>
      
      <Image
        src={photo.url}
        alt={photo.alt}
        height={photo.sizes.thumbnail.height}
        width={photo.sizes.thumbnail.width}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        className={`object-cover transition-all duration-500 group-hover:scale-105 ${isLoading ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`}
        style={aspectRatioStyles}
        onLoad={handleImageLoad}
      />
      
      {showCaption && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-serif text-lg font-light">{photo.alt}</h3>
          </div>
        </div>
      )}
    </>
  );

  const className = `group relative w-full ${aspectRatio} overflow-hidden rounded-lg bg-stone-100 ${onClick && !linkToPage ? 'cursor-pointer' : ''}`;

  if (linkToPage) {
    return (
      <Link href={`/zdjecia/${photo.id}`} className={className} style={aspectRatioStyles}>
        {content}
      </Link>
    );
  }

  return (
    <div
      className={className}
      onClick={handleClick}
    >
      {content}
    </div>
  );
} 