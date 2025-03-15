'use client';

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
  const handleClick = () => {
    if (onClick) {
      onClick(photo);
    }
  };

  const aspectRatioStyles = { aspectRatio: `${photo.width}/${photo.height}` };

  const content = (
    <>
      <Image
        src={photo.url}
        alt={photo.alt}
        height={photo.sizes.thumbnail.height}
        width={photo.sizes.thumbnail.width}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        style={aspectRatioStyles}
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

  console.log(aspectRatioStyles);

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