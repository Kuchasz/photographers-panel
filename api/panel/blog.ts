export interface BlogSelectItem  {
    label: string;
    value: string;
}

const getBlogSelectListRoute = "/api/panel/blog-select-list";
export const getBlogSelectList = () =>
    new Promise<BlogSelectItem[]>((resolve, _) => {
        fetch("http://192.168.56.102:8080" + getBlogSelectListRoute)
            .then(result => result.json())
            .then(resolve);
    });
getBlogSelectList.route = getBlogSelectListRoute;