import { Result } from "../common";

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

export interface BlogVisibilityDto {
    id: number;
    shouldBeVisible: boolean;
}

export interface BlogCreateDto {
    title: string;
    alias: string;
    date: string;
    content: string;
}

export type CreateBlogError = "ErrorOccuredWhileBlogGallery";
export type CreateBlogResult = Result<CreateBlogError>;

export type ChangeBlogVisibilityError = "ErrorOccuredWhileChangingBlogVisibility";
export type ChangeBlogVisibilityResult = Result<ChangeBlogVisibilityError>;

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

const createBlogRoute = "/api/panel/create-blog";
export const createBlog = (blog: BlogCreateDto) =>
    new Promise<CreateBlogResult>((resolve, _) => {
        fetch("http://192.168.56.102:8080" + createBlogRoute, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(blog)
        })
            .then(result => result.json())
            .then(resolve);
    });
createBlog.route = createBlogRoute;

const checkAliasIsUniqueRoute = "/api/panel/blog-alias-unique/:alias";
export const checkAliasIsUnique = (alias: string): Promise<boolean> =>
    fetch("http://192.168.56.102:8080" + checkAliasIsUniqueRoute.replace(":alias", alias)).then(resp => resp.json());
checkAliasIsUnique.route = checkAliasIsUniqueRoute;

const changeBlogVisibilityRoute = "/api/panel/blog-change-visibility";
export const changeBlogVisibility = (blogVisibility: BlogVisibilityDto) =>
    new Promise<ChangeBlogVisibilityResult>((resolve, _) => {
        fetch("http://192.168.56.102:8080" + changeBlogVisibilityRoute, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(blogVisibility)
        })
            .then(result => result.json())
            .then(resolve);
    });
changeBlogVisibility.route = changeBlogVisibilityRoute;
