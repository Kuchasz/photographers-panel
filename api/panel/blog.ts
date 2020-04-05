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

export interface BlogEditDto {
    title: string;
    alias: string;
    date: string;
    content: string;
}

export type CreateBlogError = "ErrorOccuredWhileBlogGallery";
export type CreateBlogResult = Result<CreateBlogError>;

export type ChangeBlogVisibilityError = "ErrorOccuredWhileChangingBlogVisibility";
export type ChangeBlogVisibilityResult = Result<ChangeBlogVisibilityError>;

export type BlogEditError = "ErrorOccuredWhileEditingBlog";
export type BlogEditResult = Result<BlogEditError>;

export type DeleteBlogError = "ErrorOccuredWhileDeletingBlog";
export type DeleteBlogResult = Result<DeleteBlogError>;

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
export const createBlog = (blog: BlogEditDto) =>
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

const getBlogForEditRoute = "/api/panel/blog-for-edit/:blogId";
export const getBlogForEdit = (id: number) =>
    fetch("http://192.168.56.102:8080" + getBlogForEditRoute.replace(":blogId", id.toString())).then(
        resp => resp.json() as Promise<BlogEditDto>
    );
getBlogForEdit.route = getBlogForEditRoute;

const editBlogRoute = "/api/panel/edit-blog";
export const editBlog = (id: number, blog: BlogEditDto) =>
    new Promise<BlogEditResult>((resolve, _) => {
        fetch("http://192.168.56.102:8080" + editBlogRoute, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id, blog })
        })
            .then(result => result.json())
            .then(resolve);
    });
editBlog.route = editBlogRoute;

const deleteBlogRoute = "/api/panel/remove-blog";
export const deleteBlog = (id: number) =>
    new Promise<DeleteBlogResult>((resolve, _) => {
        fetch("http://192.168.56.102:8080" + deleteBlogRoute, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id })
        })
            .then(result => result.json())
            .then(resolve);
    });
deleteBlog.route = deleteBlogRoute;
