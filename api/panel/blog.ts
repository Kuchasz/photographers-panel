export interface BlogSelectItem {
    label: string;
    value: string;
}

export interface BlogListItem {
    id: number;
    date: string;
    title: string;
    content: string;
    visits: number;
    comments: number;
    visible: boolean;
}

const getBlogSelectListRoute = "/api/panel/blog-select-list";
export const getBlogSelectList = () =>
    new Promise<BlogSelectItem[]>((resolve, _) => {
        fetch("http://192.168.56.102:8080" + getBlogSelectListRoute)
            .then(result => result.json())
            .then(resolve);
    });
getBlogSelectList.route = getBlogSelectListRoute;

const getBlogsListRoute = "/api/panel/blogs-list";
export const getBlogsList = () =>
    new Promise<BlogListItem[]>((resolve, _) => {
        fetch("http://192.168.56.102:8080" + getBlogsListRoute)
            .then(result => result.json())
            .then(resolve);
    });
getBlogsList.route = getBlogsListRoute;