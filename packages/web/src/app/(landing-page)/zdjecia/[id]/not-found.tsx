import Link from 'next/link';
import { PageContainer } from '~/components/page-container';

export default function PhotoNotFound() {
  return (
    <PageContainer>
      <div className="py-16 text-center space-y-6">
        <h1 className="text-4xl font-serif font-light text-stone-800">Zdjęcie nie znalezione</h1>
        <p className="text-lg text-stone-600">
          Przepraszamy, ale zdjęcie, którego szukasz, nie istnieje lub zostało usunięte.
        </p>
        <div className="pt-4">
          <Link 
            href="/zdjecia" 
            className="inline-block px-6 py-3 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors"
          >
            Wróć do galerii
          </Link>
        </div>
      </div>
    </PageContainer>
  );
} 