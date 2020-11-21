import { endpoint, Result } from "../common";

export interface BlogSelectItem {
    label: string;
    value: number;
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
    tags: string;
    hasAssignments: boolean;
}

export interface BlogAssetsListItemDto {
    id: number;
    url: string;
    isMain: boolean;
    alt: string;
}

export interface MainBlogAssetDto {
    id: number;
    mainBlogAsset: number;
}

export type CreateBlogError = "ErrorOccuredWhileCreatingBlog";
export type CreateBlogResult = Result<CreateBlogError>;

export type ChangeBlogVisibilityError = "ErrorOccuredWhileChangingBlogVisibility";
export type ChangeBlogVisibilityResult = Result<ChangeBlogVisibilityError>;

export type BlogEditError = "ErrorOccuredWhileEditingBlog";
export type BlogEditResult = Result<BlogEditError>;

export type DeleteBlogError = "ErrorOccuredWhileDeletingBlog";
export type DeleteBlogResult = Result<DeleteBlogError>;

export type UploadBlogAssetError = "ErrorOccuredWhileUploadingBlogAsset";
export type UploadBlogAssetResult = Result<UploadBlogAssetError, { id: number; url: string }>;

export type ChangeMainBlogAssetError = "ErrorOccuredWhileChangingMainBlogAsset";
export type ChangeMainBlogAssetResult = Result<ChangeMainBlogAssetError>;

export type DeleteBlogAssetError = "ErrorOccuredWhileDeletingBlogAsset";
export type DeleteBlogAssetResult = Result<DeleteBlogAssetError>;

export type ChangeBlogAssetAltError = "ErrorOccuredWhileChangingBlogAssetError";
export type ChangeBlogAssetAltResult = Result<ChangeBlogAssetAltError>;

const getBlogSelectListRoute = "/api/panel/blog-select-list";
export const getBlogSelectList = () =>
    new Promise<BlogSelectItem[]>((resolve, _) => {
        fetch(endpoint + getBlogSelectListRoute)
            .then((result) => result.json())
            .then(resolve);
    });
getBlogSelectList.route = getBlogSelectListRoute;

const getBlogsListRoute = "/api/panel/blogs-list";
export const getBlogsList = () =>
    new Promise<BlogListItem[]>((resolve, _) => {
        fetch(endpoint + getBlogsListRoute)
            .then((result) => result.json())
            .then(resolve);
    });
getBlogsList.route = getBlogsListRoute;

const createBlogRoute = "/api/panel/create-blog";
export const createBlog = (blog: BlogEditDto) =>
    new Promise<CreateBlogResult>((resolve, _) => {
        fetch(endpoint + createBlogRoute, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(blog)
        })
            .then((result) => result.json())
            .then(resolve);
    });
createBlog.route = createBlogRoute;

const checkAliasIsUniqueRoute = "/api/panel/blog-alias-unique/:alias/:blogId?";
export const checkAliasIsUnique = (blogId?: number) => (alias: string): Promise<boolean> =>
    fetch(
        endpoint +
        checkAliasIsUniqueRoute.replace(":alias", alias).replace(":blogId?", blogId?.toString() ?? "")
    ).then((resp) => resp.json());
checkAliasIsUnique.route = checkAliasIsUniqueRoute;

const changeBlogVisibilityRoute = "/api/panel/blog-change-visibility";
export const changeBlogVisibility = (blogVisibility: BlogVisibilityDto) =>
    new Promise<ChangeBlogVisibilityResult>((resolve, _) => {
        fetch(endpoint + changeBlogVisibilityRoute, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(blogVisibility)
        })
            .then((result) => result.json())
            .then(resolve);
    });
changeBlogVisibility.route = changeBlogVisibilityRoute;

const getBlogForEditRoute = "/api/panel/blog-for-edit/:blogId";
export const getBlogForEdit = (id: number) =>
    fetch(endpoint + getBlogForEditRoute.replace(":blogId", id.toString())).then(
        (resp) => resp.json() as Promise<BlogEditDto>
    );
getBlogForEdit.route = getBlogForEditRoute;

const editBlogRoute = "/api/panel/edit-blog";
export const editBlog = (id: number, blog: BlogEditDto) =>
    new Promise<BlogEditResult>((resolve, _) => {
        fetch(endpoint + editBlogRoute, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id, blog })
        })
            .then((result) => result.json())
            .then(resolve);
    });
editBlog.route = editBlogRoute;

const deleteBlogRoute = "/api/panel/remove-blog";
export const deleteBlog = (id: number) =>
    new Promise<DeleteBlogResult>((resolve, _) => {
        fetch(endpoint + deleteBlogRoute, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id })
        })
            .then((result) => result.json())
            .then(resolve);
    });
deleteBlog.route = deleteBlogRoute;

const uploadBlogAssetRoute = "/api/panel/upload-blog-asset";
export const uploadBlogAsset = (
    id: number,
    asset: File,
    onProgress: (progress: { processing: boolean, progress: number }) => void,
    onEnd: (result: UploadBlogAssetResult) => void
) => {
    const request = new XMLHttpRequest();

    request.upload.onloadend = () => {
        onProgress({ processing: true, progress: 100 });
    };

    request.upload.onprogress = (event: ProgressEvent) => {
        let percent = 0;
        if (event.lengthComputable) {
            percent = (event.loaded / event.total) * 100;
        }
        onProgress({ processing: percent === 100, progress: percent });
    };
    request.responseType = "json";
    request.upload.onloadstart = () => onProgress({ processing: false, progress: 0 });
    request.onload = () => onEnd(request.response);

    const payload = new FormData();
    payload.append("asset", asset);
    payload.append("blogId", id.toString());

    request.open("POST", endpoint + uploadBlogAssetRoute, true);

    request.send(payload);
};
uploadBlogAsset.route = uploadBlogAssetRoute;

const getBlogAssetsRoute = "/api/panel/blog-assets/:blogId";
export const getBlogAssets = (blogId: number): Promise<BlogAssetsListItemDto[]> =>
    fetch(endpoint + getBlogAssetsRoute.replace(":blogId", blogId.toString())).then(
        (resp) => resp.json() as Promise<BlogAssetsListItemDto[]>
    );
getBlogAssets.route = getBlogAssetsRoute;

const changeMainBlogAssetRoute = "/api/panel/blog-change-main-asset";
export const changeMainBlogAsset = (blogMainAsset: MainBlogAssetDto) =>
    new Promise<ChangeBlogVisibilityResult>((resolve, _) => {
        fetch(endpoint + changeMainBlogAssetRoute, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(blogMainAsset)
        })
            .then((result) => result.json())
            .then(resolve);
    });
changeMainBlogAsset.route = changeMainBlogAssetRoute;

const deleteBlogAssetRoute = "/api/panel/remove-blog-asset";
export const deleteBlogAsset = (id: number) =>
    new Promise<DeleteBlogResult>((resolve, _) => {
        fetch(endpoint + deleteBlogAssetRoute, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id })
        })
            .then((result) => result.json())
            .then(resolve);
    });
deleteBlogAsset.route = deleteBlogAssetRoute;

const changeBlogAssetAltRoute = "/api/panel/change-blog-asset-alt";
export const changeBlogAssetAlt = (id: number, alt: string) =>
    new Promise<ChangeBlogAssetAltResult>((resolve, _) => {
        fetch(endpoint + changeBlogAssetAltRoute, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id, alt })
        })
            .then((result) => result.json())
            .then(resolve);
    });
changeBlogAssetAlt.route = changeBlogAssetAltRoute;
