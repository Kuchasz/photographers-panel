export interface BlogEntry {
    title: string;
    date: string;
    content: string;
    photos: BlogEntryPhoto[];
}

export interface BlogEntryPhoto {
    photoUrl: string;
    altText: string;
}

export interface BlogListItem {
    title: string;
    date: string;
    alias: string;
    photoUrl: string;
}

export interface LastBlog {
    alias: string;
    content: string;
    title: string;
}

const getBlogRoute = "/api/blog/:alias";
export const getBlog = (alias: string) =>
    new Promise<BlogEntry>((resolve, _) => {
        fetch("http://192.168.56.102:8080" + getBlogRoute.replace(":alias", alias))
            .then(result => result.json())
            .then(resolve);
    });

const getBlogsListRoute = "/api/blogs-list";
export const getBlogsList = () =>
    new Promise<BlogListItem[]>((resolve, _) => {
        fetch("http://192.168.56.102:8080" + getBlogsListRoute)
            .then(result => result.json())
            .then(resolve);
    });

const getLastBlogRoute = "/api/last-blog";
export const getLastBlog = () =>
    new Promise<LastBlog>((resolve, _) => {
        fetch("http://192.168.56.102:8080" + getLastBlogRoute).then(result => result.json().then(resolve));
    });