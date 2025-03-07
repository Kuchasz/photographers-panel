'use client';

import Image from 'next/image';
import Link from 'next/link';

export type Photo = {
  id: string;
  url: string;
  alt: string;
  sizes: {
    thumbnail: {
      url: string;
      width: number;
      height: number;
    };
    card: {
      url: string;
      width: number;
      height: number;
    };
    tablet: {
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
  aspectRatio = 'aspect-[3/4]',
  showCaption = true,
  linkToPage = false,
}: PhotoTileProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(photo);
    }
  };

  const content = (
    <>
      <Image
        src={photo.url}
        alt={photo.alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
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

  const className = `group relative ${aspectRatio} overflow-hidden rounded-lg bg-stone-100 ${onClick && !linkToPage ? 'cursor-pointer' : ''}`;

  if (linkToPage) {
    return (
      <Link href={`/zdjecia/${photo.id}`} className={className}>
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