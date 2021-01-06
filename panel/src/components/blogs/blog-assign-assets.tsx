import React, { ChangeEvent } from "react";
import {
    Button,
    Icon,
    Loader,
    Progress,
    Alert,
    Whisper,
    Popover,
    FormGroup,
    ControlLabel,
    FormControl,
    Form
} from "rsuite";

import {
    BlogAssetsListItemDto,
    changeMainBlogAsset,
    deleteBlogAsset,
    changeBlogAssetAlt,
    getBlogAssets
} from "@pp/api/panel/blog";
import { range } from "@pp/utils/array";
import { ResultType } from "@pp/api/common";
import { ToolTip } from "../common/tooltip";
import { debounce } from "@pp/utils/function";
import { translations } from "../../i18n";
import { isActive, isQueued, useUploadedImages } from "../../state/uploaded-images";

type BlogAssetsListItem = Partial<BlogAssetsListItemDto>;

interface OverlayButtonProps {
    onSetAsMain: () => void;
    onDelete: () => void;
    isMain: boolean;
}

const OverlayButtons = ({ isMain, onSetAsMain, onDelete }: OverlayButtonProps) => (
    <div className="overlay-button">
        <ToolTip text={isMain ? translations.blog.assignAssets.isMain : translations.blog.assignAssets.setAsMain}>
            <Icon
                onClick={(e: MouseEvent) => {
                    if (!isMain) onSetAsMain();
                    e.stopPropagation();
                }}
                className={!isMain ? "hideable" : ""}
                icon={isMain ? "star" : "star-o"}
            />
        </ToolTip>
        {!isMain && <ToolTip text={translations.blog.assignAssets.delete}>
            <Icon
                onClick={(e: MouseEvent) => {
                    onDelete();
                    e.stopPropagation();
                }}
                className="hideable"
                icon="trash-o"
            />
        </ToolTip>}
    </div>
);

interface AssetDescriptorProps {
    item: BlogAssetsListItem;
    onAltChanged: (id: number, alt: string) => void;
}

export class AssetDescriptor extends React.Component<AssetDescriptorProps, { altText: string }> {
    constructor(props: AssetDescriptorProps) {
        super(props);
        this.state = { altText: this.props.item.alt! };
    }

    debounceChangeBlogAssetAlt = debounce((value: string) => {
        changeBlogAssetAlt(this.props.item.id!, value).then(() => this.props.onAltChanged(this.props.item.id!, value));
    }, 1000);

    changeAlt = (value: string) => {
        this.debounceChangeBlogAssetAlt(value);
        this.setState(() => ({ altText: value }));
    };

    render() {
        const { item, onAltChanged, ...props } = this.props;
        return (
            <Popover {...props} title={translations.blog.assignAssets.describeAsset}>
                <img style={{ maxWidth: "400px", maxHeight: "400px", objectFit: "contain" }} loading="lazy" src={item.url}></img>
                <Form fluid>
                    <FormGroup>
                        <ControlLabel>{translations.blog.assignAssets.description}</ControlLabel>
                        <FormControl onChange={this.changeAlt} value={this.state.altText} name="description" />
                    </FormGroup>
                </Form>
            </Popover>
        );
    }
}

interface AssetThumbProps {
    id: number
    onSetAsMain: (assetId: number) => void;
    onDelete: (assetId: number) => void;
    onAltChange: (assetId: number, alt: string) => void;
}

const AssetThumb = React.memo(({ id, onSetAsMain, onDelete, onAltChange }: AssetThumbProps) => {
    const item = useUploadedImages(x => x.assets.find(xx => xx.id === id));

    if (!item)
        throw "that should not hapeen";

    return (
        <Whisper placement="auto" speaker={<AssetDescriptor onAltChanged={onAltChange} item={item} />} trigger="click">
            <AssetsListItem className="thumb">
                <OverlayButtons
                    isMain={item.isMain!}
                    onDelete={() => onDelete(item.id!)}
                    onSetAsMain={() => onSetAsMain(item.id!)}
                />
                <img src={item.url} loading="lazy"></img>
            </AssetsListItem>
        </Whisper>
    );
});

const AssetUploadingThumb = React.memo(({ id }: { id: string }) => {
    const item = useUploadedImages(x => x.images.find(xx => xx.originId === id));

    if (!item)
        throw "that should not hapeen";

    return (
        <AssetsListItem className="thumb">
            {item.status === "failed" && <Loader inverse center />}
            {isQueued(item.status) && <Icon style={{ color: "white" }} icon="clock-o" size="lg"></Icon>}
            {isActive(item.status) && <Progress.Line strokeWidth={3} showInfo={false} status={"active"} percent={item.progress} />}
        </AssetsListItem>
    );
});

interface AssetUploadButtonProps {
    onAssetsChosen: (assets: { url: string; file: File }[]) => void;
}

const AssetUploadButton = ({ onAssetsChosen }: AssetUploadButtonProps) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const triggerFileSelect = () => {
        inputRef.current?.click();
    };

    const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ?? new FileList();
        const res = range(files.length).map(i => ({ file: files[i], url: files[i].name }));//await Promise.all(range(files.length).map((x) => read(files[x])));
        onAssetsChosen(res);
    };

    return (
        <AssetsListItem className="add-btn">
            <>
                <Button appearance="subtle" onClick={triggerFileSelect}>
                    <Icon icon="camera-retro" size="lg"></Icon>
                </Button>
                <input onChange={handleFilesChange} ref={inputRef} type="file" accept="image/*" multiple></input>
            </>
        </AssetsListItem>
    );
};

const AssetsListItem: React.FC<{ className: string; onClick?: () => void }> = ({ children, className, onClick }) => (
    <div onClick={onClick} className={`item ${className}`}>
        {children}
    </div>
);

const getItemsForBlog = <T extends { blogId: number }>(blogId: number, items: T[]) => {
    return items.filter(i => i.blogId === blogId);
}

const AssetsList = ({
    onAssetsChosen,
    blogId,
    onSetAsMain,
    onDelete,
    onAltChange
}: {
    blogId: number;
    onAssetsChosen: (assets: { url: string; file: File }[]) => void;
    onSetAsMain: (assetId: number) => void;
    onDelete: (assetId: number) => void;
    onAltChange: (assetId: number, alt: string) => void;
}) => {

    const { uploaded, assets } = useUploadedImages(
        x => ({
            uploaded: getItemsForBlog(blogId, x.images).filter(x => x.status !== "successful").map(x => x.originId),
            assets: getItemsForBlog(blogId, x.assets).map(x => x.id)
        }),
        (p, n: any) => p.assets.length === n.assets.length && p.uploaded.length === n.uploaded.length);

    return (
        <div className="assets-list">
            {assets.map((item) => <AssetThumb
                onAltChange={onAltChange}
                onDelete={onDelete}
                onSetAsMain={onSetAsMain}
                id={item}
                key={item}
            />
            )}
            {uploaded.map((item) => <AssetUploadingThumb
                id={item}
                key={item}
            />)}
            <AssetUploadButton onAssetsChosen={onAssetsChosen} />
        </div>
    )
};

export interface BlogAssignAssetsProps {
    id: number;
}
interface BlogAssignAssetsState {
}

export class BlogAssignAssets extends React.Component<BlogAssignAssetsProps, BlogAssignAssetsState> {
    constructor(props: BlogAssignAssetsProps) {
        super(props);
    }

    componentDidMount() {
        const { fetchAssets } = useUploadedImages.getState();
        fetchAssets(this.props.id);
    }

    componentDidUpdate(prevProps: BlogAssignAssetsProps) {
        if (this.props.id === prevProps.id) return;
        const { fetchAssets } = useUploadedImages.getState();
        fetchAssets(this.props.id);
    }

    handleNewAssets = (assets: { url: string; file: File }[]) => {
        const { uploadImages } = useUploadedImages.getState();
        const images = assets.map(i => ({ id: i.url, blogId: this.props.id, file: i.file, size: i.file.size, name: i.file.name }));
        uploadImages(images);
    };

    handleMarkAsMain = (assetId: number) => {
        changeMainBlogAsset({
            id: this.props.id,
            mainBlogAsset: assetId
        }).then(() => {
            const { assets, updateAsset } = useUploadedImages.getState();

            const blogAssets = getItemsForBlog(this.props.id, assets);

            console.log("Number of MAINs: ", blogAssets.filter(x => x.isMain).length);
            const newMain = blogAssets.find(x => x.id === assetId);
            const oldMain = blogAssets.find(x => x.isMain);

            if (newMain === undefined || oldMain === undefined || newMain === oldMain)
                return;

            updateAsset(oldMain.id)({ isMain: false });
            updateAsset(newMain.id)({ isMain: true });
        });
    };

    handleAltChange = (assetId: number, alt: string) => {
        const { updateAsset } = useUploadedImages.getState();
        updateAsset(assetId)({ alt });
    };

    handleDelete = (assetId: number) => {
        deleteBlogAsset(assetId).then((result) => {
            if (result.type === ResultType.Success) {
                const { deleteAsset } = useUploadedImages.getState();

                Alert.success(translations.blog.assignAssets.assetRemoved);
                deleteAsset(assetId);
            } else {
                Alert.error(translations.blog.assignAssets.assetNotRemoved);
            }
        });
    };

    render() {
        return (
            <div className="blog-assign-assets">
                <AssetsList
                    blogId={this.props.id}
                    onAssetsChosen={this.handleNewAssets}
                    onSetAsMain={this.handleMarkAsMain}
                    onDelete={this.handleDelete}
                    onAltChange={this.handleAltChange}
                />
            </div>
        );
    }
}