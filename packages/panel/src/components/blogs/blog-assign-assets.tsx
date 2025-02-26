import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import { debounce } from "@pp/utils/dist/function";
import { isActive, isQueued, useUploadedImages } from "../../state/uploaded-images";
import { range } from "@pp/utils/dist/array";
import { ResultType } from "@pp/api/dist/common";
import { ToolTip } from "../common/tooltip";
import { translations } from "../../i18n";
import {
    BlogAssetsListItemDto,
    changeBlogAssetAlt,
    changeMainBlogAsset,
    deleteBlogAsset,
} from '@pp/api/dist/panel/blog';
import {
    Button,
    Form,
    Loader,
    Message,
    Popover,
    Progress,
    useToaster,
    Whisper,
} from 'rsuite';
import {
    Camera,
    Clock,
    Star,
    StarHalf,
    Trash
} from '@phosphor-icons/react';

type BlogAssetsListItem = Partial<BlogAssetsListItemDto>;

interface OverlayButtonProps {
    onSetAsMain: () => void;
    onDelete: () => void;
    isMain: boolean;
}

const OverlayButtons = ({ isMain, onSetAsMain, onDelete }: OverlayButtonProps) => (
    <div className="overlay-button">
        <ToolTip text={isMain ? translations.blog.assignAssets.isMain : translations.blog.assignAssets.setAsMain}>
            <span
                onClick={(e: any) => {
                    if (!isMain) onSetAsMain();
                    e.stopPropagation();
                }}
                className={!isMain ? 'hideable' : ''}>
                {isMain ? <Star size={16} /> : <StarHalf size={16} />}
            </span>
        </ToolTip>
        {!isMain && (
            <ToolTip text={translations.blog.assignAssets.delete}>
                <span
                    onClick={(e: any) => {
                        onDelete();
                        e.stopPropagation();
                    }}
                    className="hideable">
                    <Trash size={16} />
                </span>
            </ToolTip>
        )}
    </div>
);

interface AssetDescriptorProps {
    item: BlogAssetsListItem;
    onAltChanged: (id: number, alt: string) => void;
}

const AssetDescriptor = ({ item, onAltChanged, ...props }: AssetDescriptorProps) => {
    const [altText, setAltText] = useState(item.alt || '');
    
    const debouncedChangeBlogAssetAlt = useRef(
        debounce((value: string) => {
            if (item.id) {
                changeBlogAssetAlt(item.id, value).then(() => onAltChanged(item.id!, value));
            }
        }, 1000)
    ).current;

    const changeAlt = (value: string) => {
        debouncedChangeBlogAssetAlt(value);
        setAltText(value);
    };

    return (
        <Popover {...props} title={translations.blog.assignAssets.describeAsset}>
            <img
                style={{
                    maxWidth: '600px',
                    maxHeight: '600px',
                    objectFit: 'contain',
                }}
                loading="lazy"
                src={item.url}
                alt={altText}
            />
            <Form fluid>
                <Form.Group>
                    <Form.ControlLabel>{translations.blog.assignAssets.description}</Form.ControlLabel>
                    <Form.Control onChange={changeAlt} value={altText} name="description" />
                </Form.Group>
            </Form>
        </Popover>
    );
};

interface AssetThumbProps {
    id: number;
    onSetAsMain: (assetId: number) => void;
    onDelete: (assetId: number) => void;
    onAltChange: (assetId: number, alt: string) => void;
}

const AssetThumb = React.memo(({ id, onSetAsMain, onDelete, onAltChange }: AssetThumbProps) => {
    const item = useUploadedImages((x) => x.assets.find((xx) => xx.id === id));

    if (!item) throw 'that should not hapeen';

    return (
        <Whisper placement="auto" speaker={<AssetDescriptor onAltChanged={onAltChange} item={item} />} trigger="click">
            <AssetsListItem className="thumb">
                <OverlayButtons
                    isMain={item.isMain!}
                    onDelete={() => onDelete(item.id!)}
                    onSetAsMain={() => onSetAsMain(item.id!)}
                />
                <img src={item.url} loading="lazy" alt={item.alt || ''}></img>
            </AssetsListItem>
        </Whisper>
    );
});

const AssetUploadingThumb = React.memo(({ id }: { id: string }) => {
    const item = useUploadedImages((x) => x.images.find((xx) => xx.originId === id));

    if (!item) throw 'that should not hapeen';

    return (
        <AssetsListItem className="thumb">
            {item.status === 'failed' && <Loader inverse center />}
            {isQueued(item.status) && <Clock size={20} style={{ color: 'white' }} />}
            {isActive(item.status) && (
                <Progress.Line strokeWidth={3} showInfo={false} status={'active'} percent={item.progress} />
            )}
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
        const res = range(files.length).map((i) => ({
            file: files[i],
            url: files[i].name,
        }));
        onAssetsChosen(res);
    };

    return (
        <AssetsListItem className="add-btn">
            <Button appearance="subtle" onClick={triggerFileSelect}>
                <Camera size={20} />
            </Button>
            <input onChange={handleFilesChange} ref={inputRef} type="file" accept="image/*" multiple></input>
        </AssetsListItem>
    );
};

const AssetsListItem: React.FC<React.PropsWithChildren<{ className: string; onClick?: () => void }>> = ({ children, className, onClick }) => (
    <div onClick={onClick} className={`item ${className}`}>
        {children}
    </div>
);

const getItemsForBlog = <T extends { blogId: number }>(blogId: number, items: T[]) => {
    return items.filter((i) => i.blogId === blogId);
};

const AssetsList = ({
    onAssetsChosen,
    blogId,
    onSetAsMain,
    onDelete,
    onAltChange,
}: {
    blogId: number;
    onAssetsChosen: (assets: { url: string; file: File }[]) => void;
    onSetAsMain: (assetId: number) => void;
    onDelete: (assetId: number) => void;
    onAltChange: (assetId: number, alt: string) => void;
}) => {
    const { uploaded, assets } = useUploadedImages((state) => ({
        uploaded: getItemsForBlog(blogId, state.images)
            .filter((x) => x.status !== 'successful')
            .map((x) => x.originId),
        assets: getItemsForBlog(blogId, state.assets).map((x) => x.id),
    }));

    return (
        <div className="assets-list">
            {assets.map((item) => (
                <AssetThumb
                    onAltChange={onAltChange}
                    onDelete={onDelete}
                    onSetAsMain={onSetAsMain}
                    id={item}
                    key={item}
                />
            ))}
            {uploaded.map((item) => (
                <AssetUploadingThumb id={item} key={item} />
            ))}
            <AssetUploadButton onAssetsChosen={onAssetsChosen} />
        </div>
    );
};

export interface BlogAssignAssetsProps {
    id: number;
}

export const BlogAssignAssets: React.FC<BlogAssignAssetsProps> = ({ id }) => {
    const toaster = useToaster();

    useEffect(() => {
        const { fetchAssets } = useUploadedImages.getState();
        fetchAssets(id);
    }, [id]);

    const handleNewAssets = (assets: { url: string; file: File }[]) => {
        const { uploadImages } = useUploadedImages.getState();
        const images = assets.map((i) => ({
            id: i.url,
            blogId: id,
            file: i.file,
            size: i.file.size,
            name: i.file.name,
        }));
        uploadImages(images);
    };

    const handleMarkAsMain = (assetId: number) => {
        changeMainBlogAsset({
            id: id,
            mainBlogAsset: assetId,
        }).then(() => {
            const { assets, updateAsset } = useUploadedImages.getState();

            const blogAssets = getItemsForBlog(id, assets);

            const newMain = blogAssets.find((x) => x.id === assetId);
            const oldMain = blogAssets.find((x) => x.isMain);

            if (newMain === undefined || oldMain === undefined || newMain === oldMain) return;

            updateAsset(oldMain.id)({ isMain: false });
            updateAsset(newMain.id)({ isMain: true });
        });
    };

    const handleAltChange = (assetId: number, alt: string) => {
        const { updateAsset } = useUploadedImages.getState();
        updateAsset(assetId)({ alt });
    };

    const handleDelete = (assetId: number) => {
        deleteBlogAsset(assetId).then((result) => {
            if (result.type === ResultType.Success) {
                const { deleteAsset } = useUploadedImages.getState();

                toaster.push(
                    <Message type="success">{translations.blog.assignAssets.assetRemoved}</Message>
                );
                deleteAsset(assetId);
            } else {
                toaster.push(
                    <Message type="error">{translations.blog.assignAssets.assetNotRemoved}</Message>
                );
            }
        });
    };

    return (
        <div className="blog-assign-assets">
            <AssetsList
                blogId={id}
                onAssetsChosen={handleNewAssets}
                onSetAsMain={handleMarkAsMain}
                onDelete={handleDelete}
                onAltChange={handleAltChange}
            />
        </div>
    );
};
