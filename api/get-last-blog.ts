export interface LastBlog {
    alias: string;
    content: string;
    title: string;
};

export const route = '/api/last-blog';

export const getLastBlog = () => new Promise<LastBlog>((resolve, _) => {
    fetch('http://192.168.56.102:8080'+route).then(result => result.json().then(resolve));
});