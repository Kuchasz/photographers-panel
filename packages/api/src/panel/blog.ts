import { endpoint, f, Result } from "../common";
import { getDateString } from "@pp/utils/dist/date";
import { getLastBytesPerSecond } from "@pp/utils/dist/file";
import { VisitsSummaryDto } from "./visits";

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

export interface BlogVisitsDto {
    todayVisits: number;
    totalVisits: number;
    rangeDays: number;
    rangeVisits: number;
    bestDay: VisitsSummaryDto;
    dailyVisits: VisitsSummaryDto[];
}

export interface MainBlogsDto {
    leftBlog?: number;
    rightBlog?: number;
}

export type CreateBlogError = 'ErrorOccuredWhileCreatingBlog';
export type CreateBlogResult = Result<CreateBlogError>;

export type ChangeBlogVisibilityError = 'ErrorOccuredWhileChangingBlogVisibility';
export type ChangeBlogVisibilityResult = Result<ChangeBlogVisibilityError>;

export type BlogEditError = 'ErrorOccuredWhileEditingBlog';
export type BlogEditResult = Result<BlogEditError>;

export type DeleteBlogError = 'ErrorOccuredWhileDeletingBlog';
export type DeleteBlogResult = Result<DeleteBlogError>;

export type UploadBlogAssetError = 'ErrorOccuredWhileUploadingBlogAsset';
export type UploadBlogAssetResult = Result<UploadBlogAssetError, { id: number; url: string; isMain: boolean }>;

export type ChangeMainBlogAssetError = 'ErrorOccuredWhileChangingMainBlogAsset';
export type ChangeMainBlogAssetResult = Result<ChangeMainBlogAssetError>;

export type DeleteBlogAssetError = 'ErrorOccuredWhileDeletingBlogAsset';
export type DeleteBlogAssetResult = Result<DeleteBlogAssetError>;

export type ChangeBlogAssetAltError = 'ErrorOccuredWhileChangingBlogAssetError';
export type ChangeBlogAssetAltResult = Result<ChangeBlogAssetAltError>;

export type ChangeMainBlogsError = 'ErrorOccuredWhileChangingMainBlogs';
export type ChangeMainBlogsResult = Result<ChangeMainBlogsError>;

const getBlogSelectListRoute = '/api/panel/blog-select-list';
export const getBlogSelectList = () => f.get<BlogSelectItem[]>(getBlogSelectListRoute);
getBlogSelectList.route = getBlogSelectListRoute;

const getBlogsListRoute = '/api/panel/blogs-list';
export const getBlogsList = () => f.get<BlogListItem[]>(getBlogsListRoute);
getBlogsList.route = getBlogsListRoute;

const createBlogRoute = '/api/panel/create-blog';
export const createBlog = (blog: BlogEditDto) => f.post<CreateBlogResult>(createBlogRoute, blog);
createBlog.route = createBlogRoute;

const checkAliasIsUniqueRoute = '/api/panel/blog-alias-unique/:alias/:blogId?';
export const checkAliasIsUnique = (blogId?: number) => (alias: string) =>
    f.get<boolean>(checkAliasIsUniqueRoute.replace(':alias', alias).replace(':blogId?', blogId?.toString() ?? ''));
checkAliasIsUnique.route = checkAliasIsUniqueRoute;

const changeBlogVisibilityRoute = '/api/panel/blog-change-visibility';
export const changeBlogVisibility = (blogVisibility: BlogVisibilityDto) =>
    f.post<ChangeBlogVisibilityResult>(changeBlogVisibilityRoute, blogVisibility);
changeBlogVisibility.route = changeBlogVisibilityRoute;

const getBlogForEditRoute = '/api/panel/blog-for-edit/:blogId';
export const getBlogForEdit = (id: number) => f.get<BlogEditDto>(getBlogForEditRoute.replace(':blogId', id.toString()));
getBlogForEdit.route = getBlogForEditRoute;

const editBlogRoute = '/api/panel/edit-blog';
export const editBlog = (id: number, blog: BlogEditDto) => f.post<BlogEditResult>(editBlogRoute, { id, blog });
editBlog.route = editBlogRoute;

const deleteBlogRoute = '/api/panel/remove-blog';
export const deleteBlog = (id: number) => f.post<DeleteBlogResult>(deleteBlogRoute, { id });
deleteBlog.route = deleteBlogRoute;

const uploadBlogAssetRoute = '/api/panel/upload-blog-asset';
export const uploadBlogAsset = (
    id: number,
    asset: File,
    onProgress: (progress: {
        processing: boolean;
        progress: number;
        loaded: number;
        lastBytesPerSecond: number;
    }) => void,
    onEnd: (result: UploadBlogAssetResult) => void
) => {
    const request = new XMLHttpRequest();

    let lastNow = new Date().getTime();
    let lastBytes = 0;

    request.upload.onloadend = (event: ProgressEvent) => {
        const r = getLastBytesPerSecond(lastBytes, lastNow, event.loaded);
        onProgress({
            processing: true,
            progress: 100,
            loaded: event.loaded,
            lastBytesPerSecond: r.lastBytesPerSecond,
        });
    };

    request.upload.onprogress = (event: ProgressEvent) => {
        const r = getLastBytesPerSecond(lastBytes, lastNow, event.loaded);

        lastBytes = event.loaded;
        lastNow = r.calculationTime;

        let percent = 0;
        if (event.lengthComputable) {
            percent = (event.loaded / event.total) * 100;
        }
        onProgress({
            processing: percent === 100,
            progress: percent,
            loaded: event.loaded,
            lastBytesPerSecond: r.lastBytesPerSecond,
        });
    };
    request.responseType = 'json';
    request.upload.onloadstart = (e) => {
        onProgress({
            processing: false,
            progress: 0,
            loaded: 0,
            lastBytesPerSecond: 0,
        });
    };
    request.onload = () => onEnd(request.response);

    const payload = new FormData();
    payload.append('asset', asset);
    payload.append('blogId', id.toString());

    request.open('POST', endpoint + uploadBlogAssetRoute, true);

    request.send(payload);
};
uploadBlogAsset.route = uploadBlogAssetRoute;

const getBlogAssetsRoute = '/api/panel/blog-assets/:blogId';
export const getBlogAssets = (blogId: number) =>
    f.get<BlogAssetsListItemDto[]>(getBlogAssetsRoute.replace(':blogId', blogId.toString()));
getBlogAssets.route = getBlogAssetsRoute;

const changeMainBlogAssetRoute = '/api/panel/blog-change-main-asset';
export const changeMainBlogAsset = (blogMainAsset: MainBlogAssetDto) =>
    f.post<ChangeBlogVisibilityResult>(changeMainBlogAssetRoute, blogMainAsset);
changeMainBlogAsset.route = changeMainBlogAssetRoute;

const deleteBlogAssetRoute = '/api/panel/remove-blog-asset';
export const deleteBlogAsset = (id: number) => f.post<DeleteBlogResult>(deleteBlogAssetRoute, { id });
deleteBlogAsset.route = deleteBlogAssetRoute;

const changeBlogAssetAltRoute = '/api/panel/change-blog-asset-alt';
export const changeBlogAssetAlt = (id: number, alt: string) =>
    f.post<ChangeBlogAssetAltResult>(changeBlogAssetAltRoute, { id, alt });
changeBlogAssetAlt.route = changeBlogAssetAltRoute;

const getBlogVisitsRoute = '/api/panel/blog-stats/:start/:end/:blogId';
export const getBlogVisits = (startDate: Date, endDate: Date, selectedGallery: number) =>
    f.get<BlogVisitsDto>(
        getBlogVisitsRoute
            .replace(':start', getDateString(startDate))
            .replace(':end', getDateString(endDate))
            .replace(':blogId', selectedGallery.toString())
    );
getBlogVisits.route = getBlogVisitsRoute;

const getMainBlogsRoute = '/api/panel/main-blogs';
export const getMainBlogs = () => f.get<MainBlogsDto>(getMainBlogsRoute);
getMainBlogs.route = getMainBlogsRoute;

const changeMainBlogsRoute = '/api/panel/change-main-blogs';
export const changeMainBlogs = (mainBlogs: MainBlogsDto) =>
    f.post<ChangeMainBlogsResult>(changeMainBlogsRoute, mainBlogs);
changeMainBlogs.route = changeMainBlogsRoute;
