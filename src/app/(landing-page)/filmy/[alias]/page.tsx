import { notFound } from "next/navigation";
import Link from "next/link";
import { strings } from "~/resources";
import { PageContainer } from "~/components/page-container";
import { type Metadata } from "next";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { getVideos, getVideoByAlias } from "../actions";

interface VideoDetailPageProps {
    params: Promise<{
        alias: string;
    }>;
}

export async function generateMetadata({ params }: VideoDetailPageProps): Promise<Metadata> {
    const { alias } = await params;
    const video = await getVideoByAlias(alias);

    if (!video) {
        return {
            title: 'Film nie został znaleziony | Fotografia',
        };
    }

    return {
        title: `${video.title} | Filmy | Fotografia`,
        description: video.descshort || 'Obejrzyj profesjonalny film z naszej kolekcji.',
    };
}

export default async function VideoDetailPage({ params }: VideoDetailPageProps) {
    const { alias } = await params;
    const video = await getVideoByAlias(alias);

    // If video not found, return 404
    if (!video) {
        notFound();
    }
    
    return (
        <PageContainer className="pt-8 pb-16 md:pt-12 md:pb-24">
            <Link
                href="/filmy"
                className="inline-flex items-center mb-10 text-stone-600 hover:text-stone-800 transition-colors group"
            >
                <span className="mr-2 bg-stone-100 rounded-full p-1.5 group-hover:bg-stone-200 transition-colors">
                    <ArrowLeft size={16} weight="bold" />
                </span>
                <span className="font-light">{strings.menu.videos}</span>
            </Link>

            <header className="mb-12 max-w-4xl">
                <h1 className="mb-4 font-serif text-3xl font-light tracking-wide text-stone-800 md:text-4xl">
                    {video.title}
                </h1>
                {video.desc && (
                    <p className="text-lg font-light text-stone-600 leading-relaxed">
                        {video.desc}
                    </p>
                )}
            </header>

            <div className="mx-auto max-w-4xl">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-xl mb-10">
                    <iframe
                        src={video.videoUrl}
                        title={video.title}
                        className="absolute inset-0 h-full w-full"
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                    />
                </div>

                {/* Add video metadata section here if needed in the future */}
                {/* Currently removed due to type constraints */}
            </div>
        </PageContainer>
    );
} 