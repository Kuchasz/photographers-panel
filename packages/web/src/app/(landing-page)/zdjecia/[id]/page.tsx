import { type Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from '@phosphor-icons/react';
import { PageContainer } from '~/components/page-container';
import { getPhoto } from '../actions';
import { type Photo } from '../photo-tile';

type PhotoPageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: PhotoPageProps): Promise<Metadata> {
  const photo = await getPhoto(params.id);

  if (!photo) {
    return {
      title: 'Zdjęcie nie znalezione | Fotografia',
      description: 'Zdjęcie nie zostało znalezione',
    };
  }

  return {
    title: `${photo.alt || 'Photo'} | Fotografia`,
    description: `Zdjęcie: ${photo.alt || 'Fotografia'}`,
  };
}

export default async function PhotoPage({ params }: PhotoPageProps) {
  const photo = await getPhoto(params.id);

  if (!photo) {
    notFound();
  }

  // Transform the data to match the expected format
  const defaultUrl = photo.url ?? '';
  const transformedPhoto: Photo = {
    id: String(photo.id),
    alt: photo.alt ?? '',
    url: defaultUrl,
    sizes: {
      thumbnail: {
        url: photo.sizes?.thumbnail?.url ?? defaultUrl,
        width: photo.sizes?.thumbnail?.width ?? 400,
        height: photo.sizes?.thumbnail?.height ?? 300,
      },
      card: {
        url: photo.sizes?.card?.url ?? defaultUrl,
        width: photo.sizes?.card?.width ?? 768,
        height: photo.sizes?.card?.height ?? 1024,
      },
      tablet: {
        url: photo.sizes?.tablet?.url ?? defaultUrl,
        width: photo.sizes?.tablet?.width ?? 1024,
        height: photo.sizes?.tablet?.height ?? 768,
      },
    }
  };

  return (
    <PageContainer>
      <div className="space-y-8">
        <Link 
          href="/zdjecia" 
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Powrót do galerii</span>
        </Link>

        <div className="relative aspect-[4/3] md:aspect-[16/9] lg:aspect-auto lg:h-[70vh] w-full overflow-hidden rounded-lg">
          <Image
            src={transformedPhoto.url ?? transformedPhoto.sizes.tablet.url}
            alt={transformedPhoto.alt}
            fill
            sizes="(max-width: 768px) 100vw, 90vw"
            className="object-contain"
            priority
          />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-serif font-light text-stone-800">{transformedPhoto.alt}</h1>
        </div>
      </div>
    </PageContainer>
  );
} 