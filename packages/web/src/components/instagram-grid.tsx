import { ArrowRight, Image as ImageIcon, Play } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { type InstagramPost } from "~/lib/instagram";
import { Button } from "~/components/button";
import { strings } from "~/resources";

type InstagramGridProps = {
    posts: InstagramPost[];
    maxPosts?: number;
};

const getMediaTypeIcon = (mediaType: InstagramPost['media_type']) => {
    switch (mediaType) {
        case 'VIDEO':
            return <Play weight="fill" className="text-white" />;
        case 'CAROUSEL_ALBUM':
            return <ArrowRight weight="fill" className="text-white" />;
        default:
            return <ImageIcon weight="fill" className="text-white" />;
    }
};

export function InstagramGrid({ posts, maxPosts = 6 }: InstagramGridProps) {
    // Limit the number of posts to display
    const visiblePosts = posts.slice(0, maxPosts);

    if (!posts.length) return null;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {visiblePosts.map((post) => (
                    <Link
                        key={post.id}
                        href={post.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative overflow-hidden rounded-lg bg-stone-100 aspect-square"
                    >
                        {/* Post image */}
                        <img
                            src={post.thumbnail_url ?? post.media_url}
                            alt={post.caption ?? "Instagram post"}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />

                        {/* Overlay with fade effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        {/* Media type indicator in top right corner */}
                        <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60">
                            {getMediaTypeIcon(post.media_type)}
                        </div>

                        {/* Caption on hover */}
                        <div className="absolute bottom-0 left-0 right-0 p-2 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <p className="line-clamp-1 text-xs font-light">
                                {post.caption ?? ""}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="flex justify-center">
                <Button
                    href="https://www.instagram.com/pyszstudio/"
                    variant="hero"
                >
                    <div className="flex items-center gap-2">
                        <span>{strings.instagram.followUs}</span>
                    </div>
                </Button>
            </div>
        </div>
    );
} 