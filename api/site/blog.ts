import { f } from '../common';

export interface Blog {
    id: number;
    title: string;
    date: string;
    content: string;
    assets: BlogAsset[];
}

export interface BlogAsset {
    url: string;
    alt: string;
}

export type BlogListItem = {
    title: string;
    date: string;
    alias: string;
    photoUrl: string;
    photoAlt: string;
    content: string;
}

export type MostRecentBlogListItem = BlogListItem & { isMain: boolean };

const getBlogRoute = '/api/blog/:alias';
export const getBlog = (alias: string) => f.get<Blog>(getBlogRoute.replace(':alias', alias));
getBlog.route = getBlogRoute;

const getBlogsListRoute = '/api/blogs-list';
export const getBlogsList = () => f.get<BlogListItem[]>(getBlogsListRoute);
getBlogsList.route = getBlogsListRoute;

const getLastBlogsRoute = '/api/last-blogs';
export const getLastBlogs = () => f.get<MostRecentBlogListItem[]>(getLastBlogsRoute);
getLastBlogs.route = getLastBlogsRoute;
