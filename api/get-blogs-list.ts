export interface BlogListItem {
    title: string;
    date: string;
    alias: string;
    photoUrl: string;
};

export const route = '/api/blogs-list';

export const getBlogsList = () => new Promise<BlogListItem[]>((resolve, _) => {
    fetch('http://192.168.56.102:8080'+route).then(result => result.json().then(resolve));
});