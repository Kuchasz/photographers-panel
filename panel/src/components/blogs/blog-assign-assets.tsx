import React, { ChangeEvent } from "react";
import { Modal, Button, Icon, IconButton, Loader, Progress, Alert } from "rsuite";
import {
    BlogAssetsListItemDto,
    uploadBlogAsset,
    getBlogAssets,
    changeMainBlogAsset,
    deleteBlogAsset
} from "../../../../api/panel/blog";
import { range, union, distinctBy } from "../../../../utils/array";
import { inRange } from "../../../../utils/number";
import { read } from "../../../../utils/file";
import { ResultType } from "../../../../api/common";
import { ToolTip } from "../common/tooltip";

type BlogAssetsListItem = Partial<BlogAssetsListItemDto & { file: File }>;

interface Props {
    id: number;
    showBlogAssignAssets: boolean;
    closeAssignAssets: () => void;
}
interface State {
    assets: BlogAssetsListItem[];
}

interface OverlayButtonProps {
    onClick: () => void;
    onDelete: () => void;
    isMain: boolean;
}

const OverlayButtons = ({ isMain, onClick, onDelete }: OverlayButtonProps) => (
    <div className="overlay-button">
        <ToolTip text={isMain ? "Asset is main" : "Set asset as main"}>
            <Icon onClick={onClick} className={!isMain ? "hideable" : ""} icon={isMain ? "star" : "star-o"} />
        </ToolTip>
        <ToolTip text="Delete asset">
            <Icon onClick={onDelete} className="hideable" icon="trash-o" />
        </ToolTip>
    </div>
);

interface AssetThumbProps {
    item: BlogAssetsListItem;
    onSetAsMain: (assetId: number) => void;
    onDelete: (assetId: number) => void;
}

const AssetThumb = ({ item, onSetAsMain, onDelete }: AssetThumbProps) => {
    return (
        <AssetsListItem className="thumb">
            {Math.random() === 1 ? (
                <IconButton
                    onClick={() => onSetAsMain(item.id!)}
                    icon={item.isMain ? <Icon icon="star" /> : <Icon icon="star-o" />}
                    circle
                    size="xs"
                />
            ) : null}
            <OverlayButtons
                isMain={item.isMain!}
                onDelete={() => onDelete(item.id!)}
                onClick={() => onSetAsMain(item.id!)}
            />
            <img src={item.url}></img>
        </AssetsListItem>
    );
};

const AssetUploadingThumb = ({
    item,
    blogId,
    onUpload
}: {
    item: BlogAssetsListItem;
    blogId: number;
    onUpload(id: number, url: string, oldURL: string): void;
}) => {
    const [processing, setProcessing] = React.useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = React.useState<number>(0);

    React.useEffect(() => {
        uploadBlogAsset(
            blogId,
            item.file!,
            (p) => setUploadProgress(p),
            () => setProcessing(true),
            (res) => {
                setProcessing(false);
                res.type === ResultType.Success && onUpload(res.result!.id, res.result!.url, item.url!);
            }
        );
    }, []);

    return (
        <AssetsListItem className="thumb">
            {processing && <Loader inverse backdrop center />}
            {inRange(0, 100, uploadProgress) && (
                <Progress.Line strokeWidth={3} showInfo={false} status={"active"} percent={uploadProgress} />
            )}
        </AssetsListItem>
    );
};

interface AssetUploadButtonProps {
    onAssetsChosen: (assets: { url: string; file: File }[]) => void;
}

const AssetUploadButton = ({ onAssetsChosen }: AssetUploadButtonProps) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const triggerFileSelect = () => {
        inputRef.current?.click();
    };

    const handleFilesChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ?? new FileList();
        const res = await Promise.all(range(files.length).map((x) => read(files[x])));
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

const AssetsListItem: React.FC<{ className: string }> = ({ children, className }) => (
    <div className={`item ${className}`}>{children}</div>
);

const AssetsList = ({
    items,
    onAssetsChosen,
    blogId,
    onUploaded,
    onSetAsMain,
    onDelete
}: {
    blogId: number;
    items: BlogAssetsListItem[];
    onAssetsChosen: (assets: { url: string; file: File }[]) => void;
    onUploaded: (id: number, url: string, oldURL: string) => void;
    onSetAsMain: (assetId: number) => void;
    onDelete: (assetId: number) => void;
}) => (
    <div className="assets-list">
        {items.map((item) =>
            item.id !== undefined ? (
                <AssetThumb onDelete={onDelete} onSetAsMain={onSetAsMain} item={item} key={item.id} />
            ) : (
                <AssetUploadingThumb
                    blogId={blogId}
                    item={item}
                    key={item.url}
                    onUpload={(id, url, oldURL) => onUploaded(id, url, oldURL)}
                />
            )
        )}
        <AssetUploadButton onAssetsChosen={onAssetsChosen} />
    </div>
);

export class BlogAssignAssets extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { assets: [] };
    }

    componentDidMount() {
        getBlogAssets(this.props.id).then((assets) => {
            this.setState({ assets });
        });
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.id === prevProps.id) return;
        getBlogAssets(this.props.id).then((assets) => {
            this.setState({ assets });
        });
    }

    handleNewAssets = (assets: { url: string; file: File }[]) => {
        this.setState((state) => {
            const finalAssets = distinctBy(
                union(
                    state.assets,
                    assets //.map((x) => ({ url: x.url }))
                ),
                (x) => x.url
            );

            return { assets: finalAssets };
        });
    };

    handleAssetsUploaded = (id: number, url: string, oldURL: string) => {
        this.setState((state) => {
            const cindex = state.assets.map((x) => x.url).indexOf(oldURL);
            const assets = [...state.assets.slice(0, cindex), { id, url }, ...state.assets.slice(cindex + 1)];
            return { assets };
        });
    };

    handleMarkAsMain = (assetId: number) => {
        changeMainBlogAsset({
            id: this.props.id,
            mainBlogAsset: assetId
        }).then(() => {
            this.setState((state) => {
                const newMainIndex = state.assets.map((x) => x.id).indexOf(assetId);
                const oldMainIndex = state.assets.indexOf(state.assets.filter((x) => x.isMain)[0]);

                const newMain = state.assets[newMainIndex];
                const oldMain = state.assets[oldMainIndex];

                let assets = [
                    ...state.assets.slice(0, newMainIndex),
                    { ...newMain, isMain: true },
                    ...state.assets.slice(newMainIndex + 1)
                ];

                if (oldMain)
                    assets = [
                        ...assets.slice(0, oldMainIndex),
                        { ...oldMain, isMain: false },
                        ...assets.slice(oldMainIndex + 1)
                    ];

                return { assets };
            });
        });
    };

    handleDelete = (assetId: number) => {
        deleteBlogAsset(assetId).then((result) => {
            if (result.type === ResultType.Success) {
                Alert.success("Blog asset removed.");
                this.setState((state) => ({ assets: state.assets.filter((a) => a.id !== assetId) }));
            } else {
                Alert.error("An error ocurred while removing blog asset.");
            }
        });
    };

    handleModalHide = () => {
        this.props.closeAssignAssets();
    };

    render() {
        return (
            <Modal
                className="blog-assign-assets"
                size={"lg"}
                show={this.props.showBlogAssignAssets}
                onHide={this.handleModalHide}
            >
                <Modal.Header>
                    <Modal.Title>Assign blog assets</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AssetsList
                        blogId={this.props.id}
                        onAssetsChosen={this.handleNewAssets}
                        onUploaded={this.handleAssetsUploaded}
                        onSetAsMain={this.handleMarkAsMain}
                        onDelete={this.handleDelete}
                        items={this.state.assets}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.closeAssignAssets} appearance="primary">
                        Save
                    </Button>
                    <Button onClick={this.handleModalHide} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
