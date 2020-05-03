export interface Blog {
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
}

export interface LastBlog {
    alias: string;
    content: string;
    title: string;
}

const getBlogRoute = "/api/blog/:alias";
export const getBlog = (alias: string) =>
    new Promise<Blog>((resolve, _) => {
        fetch("http://192.168.56.102:8080" + getBlogRoute.replace(":alias", alias))
            .then(result => result.json())
            .then(resolve);
    });
getBlog.route = getBlogRoute;

const getBlogsListRoute = "/api/blogs-list";
export const getBlogsList = () =>
    new Promise<BlogListItem[]>((resolve, _) => {
        fetch("http://192.168.56.102:8080" + getBlogsListRoute)
            .then(result => result.json())
            .then(resolve);
    });
getBlogsList.route = getBlogsListRoute;

const getLastBlogRoute = "/api/last-blog";
export const getLastBlog = () =>
    new Promise<LastBlog>((resolve, _) => {
        fetch("http://192.168.56.102:8080" + getLastBlogRoute).then(result => result.json().then(resolve));
    });
getLastBlog.route = getLastBlogRoute;
