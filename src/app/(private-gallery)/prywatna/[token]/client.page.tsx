'use client';

import { type Photo, PhotoGallery } from "~/components/gallery";
import { SectionTitle } from "~/components/section-title";
import { strings } from "~/resources";
import { useParams } from "next/navigation";
import { downloadPhotoWithCors } from "./actions";
import { saveBlobAsDownload } from "~/lib/file";

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

.animate-photo-zoom {
  animation: photoZoom 20s ease-in-out infinite;
}

.animate-title-zoom {
  animation: titleZoom 20s ease-in-out infinite;
}
`;

type PrivateGalleryClientPageProps = {
  photos: Photo[];
  galleryTitle?: string;
  galleryDate?: string;
  photo?: Photo | null;
};

export default function PrivateGalleryClientPage({ photos, galleryTitle = '', galleryDate = '', photo }: PrivateGalleryClientPageProps) {
  const { token } = useParams<{ token: string }>();

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

  const displayTitle = galleryTitle || strings.privateGallery.title;
  const formattedDate = galleryDate ? new Date(galleryDate).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  return (
    <>
      <style jsx>{styles}</style>
      <div className="relative flex flex-col align-center w-full bg-gold-600 px-36 pb-36 h-[80vh] mb-18 overflow-hidden">
        <div className="flex justify-center items-center py-12 text-lg text-white/90">
          <p className="text-xs mr-24 absolute -translate-x-1/2 font-bold uppercase tracking-[0.4em]">{strings.pageTitles.private}</p>
          <span className="w-0.5 h-24 bg-white/90 rounded-full"></span>
          {formattedDate && (
            <p className="absolute ml-24 translate-x-1/2 font-serif text-center">
              {formattedDate}
            </p>
          )}
        </div>
        {photo && (
          <div className="aspect-square overflow-hidden h-full relative">
            <img
              src={photo.sizes?.big?.url || photo.url}
              alt={photo.alt || ''}
              className="w-full h-full object-cover animate-photo-zoom"
            />
            <div className="absolute inset-0 bg-black/40">
              <div className="absolute top-[66%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4">
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
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-title-zoom">
              <SectionTitle
                title={displayTitle}
                className="[&_p]:text-white/90 [&_h2]:text-white"
              />
            </div>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4">
        {photos.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-stone-600">
              {strings.privateGallery.unavailable}
            </p>
          </div>
        ) : (
          <PhotoGallery photos={photos} onPhotoDownload={handleDownload} />
        )}
      </div>
    </>
  );
} 