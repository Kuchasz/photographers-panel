'use client';

import { useParams } from "next/navigation";
import { useRef } from "react";
import { type Photo } from "~/components/gallery";
import { SectionTitle } from "~/components/section-title";
import { strings } from "~/resources";
import { PhotosClient } from "./photos.client";

const styles = `
@keyframes photoZoom {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes titleZoom {
  0% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.animate-photo-zoom {
  animation: photoZoom 20s ease-in-out infinite;
}

.animate-title-zoom {
  animation: titleZoom 20s ease-in-out infinite;
}

.aspect-2-3 {
  max-aspect-ratio: 3/2;
}

.bounce-arrow {
  animation: bounce 2s infinite;
}
`;

type PrivateGalleryClientPageProps = {

  galleryTitle?: string;
  galleryDate?: string;
  photo?: Photo | null;
};

export default function PrivateGalleryClientPage({ galleryTitle = '', galleryDate = '', photo }: PrivateGalleryClientPageProps) {
  const { token } = useParams<{ token: string }>();
  const photosRef = useRef<HTMLDivElement>(null);



  const scrollToPhotos = () => {
    photosRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const displayTitle = galleryTitle || strings.privateGallery.title;
  const formattedDate = galleryDate ? new Date(galleryDate).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  return (
    <>
      <style jsx>{styles}</style>
      <div className="relative flex flex-col align-center w-full bg-gold-300 px-4 md:px-24 lg:px-36 pb-12 md:pb-16 h-[60vh] min-h-dvh mb-12 md:mb-16 overflow-hidden">
        <div className="flex sm:hidden gap-2 flex-col py-6 md:py-12 text-lg text-white/90">
          <p className="text-xs md:text-xs mr-6 md:mr-24 font-bold uppercase tracking-[0.3em] md:tracking-[0.4em]">{strings.pageTitles.private}</p>
          <span className="w-24 h-0.5 bg-white/90 rounded-full"></span>
          {formattedDate && (
            <p className="text-sm md:text-base font-serif">
              {formattedDate}
            </p>
          )}
        </div>
        <div className="hidden sm:flex justify-center items-center py-6 md:py-12 text-lg text-white/90">
          <p className="text-xs mr-6 md:mr-24 absolute -translate-x-1/2 font-bold uppercase tracking-[0.3em] md:tracking-[0.4em]">{strings.pageTitles.private}</p>
          <span className="w-0.5 h-12 md:h-24 bg-white/90 rounded-full"></span>
          {formattedDate && (
            <p className="text-sm md:text-base absolute ml-6 md:ml-24 translate-x-1/2 font-serif text-center">
              {formattedDate}
            </p>
          )}
        </div>
        {photo && (
          <div className="aspect-2-3 overflow-hidden h-full relative mx-auto">
            <img
              src={photo.sizes?.big?.url || photo.url}
              alt={photo.alt || ''}
              className="w-full h-full object-cover animate-photo-zoom"
            />
            <div className="absolute inset-0 bg-black/40">
              <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4">
                <div className="animate-title-zoom">
                  <SectionTitle
                    title={displayTitle}
                    className="[&_p]:text-white/90 [&_h2]:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {!photo && (
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="animate-title-zoom">
              <SectionTitle
                title={displayTitle}
                className="[&_p]:text-white/90 [&_h2]:text-white"
              />
            </div>
          </div>
        )}
        <div
          onClick={scrollToPhotos}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/80 cursor-pointer group"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/80 hover:bg-white/10 transition-colors">
            <span className="text-sm font-medium ml-1">Zobacz zdjęcia</span>
            <svg
              className="w-4 h-4 bounce-arrow"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
      <div ref={photosRef} className="container mx-auto px-4">
        <PhotosClient token={token} />
      </div>
    </>
  );
} 