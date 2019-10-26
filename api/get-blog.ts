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

export const route = "/api/blog/:alias";

export const getBlog = (alias: string) =>
    new Promise<BlogEntry>((resolve, _) => {
        fetch("http://192.168.56.102:8080" + route.replace(":alias", alias))
            .then(result => result.json())
            .then(resolve);
    });
