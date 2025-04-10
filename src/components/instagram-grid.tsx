import { FilmStrip, Image as ImageIcon, Images, InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Button } from "~/components/button";
import { type InstagramPost } from "~/lib/instagram";
import { strings } from "~/resources";

type InstagramGridProps = {
    posts: InstagramPost[];
    maxPosts?: number;
};

const getMediaTypeIcon = (mediaType: InstagramPost['media_type']) => {
    switch (mediaType) {
        case 'VIDEO':
            return <FilmStrip weight="fill" className="text-white size-4" />;
        case 'CAROUSEL_ALBUM':
            return <Images weight="fill" className="text-white size-4" />;
        default:
            return <ImageIcon weight="fill" className="text-white size-4" />;
    }
};

export function InstagramGrid({ posts, maxPosts = 6 }: InstagramGridProps) {
    const visiblePosts = posts.slice(0, maxPosts);

    return (
        <div className="space-y-6">
            {visiblePosts.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {visiblePosts.map((post) => (
                        <Link
                            key={post.id}
                            href={post.permalink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative overflow-hidden rounded-lg bg-stone-100 aspect-square"
                        >
                            <img
                                src={post.thumbnail_url ?? post.media_url}
                                alt={post.caption ?? "Instagram post"}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                            <div className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 backdrop-blur-sm shadow-sm transition-transform duration-300 group-hover:scale-110">
                                {getMediaTypeIcon(post.media_type)}
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-2 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <p className="line-clamp-1 text-xs font-light">
                                    {post.caption ?? ""}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <div className="flex justify-center">
                <Button
                    href="https://www.instagram.com/pyszstudio/"
                    variant="hero"
                >
                    <div className="flex items-center gap-2">
                        <span>{strings.instagram.followUs}</span>
                        <InstagramLogo size={24} weight="bold" />
                    </div>
                </Button>
            </div>
        </div>
    );
} 