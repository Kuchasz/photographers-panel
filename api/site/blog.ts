import { endpoint } from "../common";

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

export interface BlogListItem {
    title: string;
    date: string;
    alias: string;
    photoUrl: string;
    content: string;
}

const getBlogRoute = "/api/blog/:alias";
export const getBlog = (alias: string) =>
    new Promise<Blog>((resolve, _) => {
        fetch(endpoint + getBlogRoute.replace(":alias", alias))
            .then(result => result.json())
            .then(resolve);
    });
getBlog.route = getBlogRoute;

const getBlogsListRoute = "/api/blogs-list";
export const getBlogsList = () =>
    new Promise<BlogListItem[]>((resolve, _) => {
        fetch(endpoint + getBlogsListRoute)
            .then(result => result.json())
            .then(resolve);
    });
getBlogsList.route = getBlogsListRoute;

const getLastBlogsRoute = "/api/last-blogs";
export const getLastBlogs = () =>
    new Promise<BlogListItem[]>((resolve, _) => {
        fetch(endpoint + getLastBlogsRoute).then(result => result.json().then(resolve));
    });
getLastBlogs.route = getLastBlogsRoute;
