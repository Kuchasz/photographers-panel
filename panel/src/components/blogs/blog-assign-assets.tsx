import React, { ChangeEvent } from "react";
import {
    Modal,
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
    uploadBlogAsset,
    getBlogAssets,
    changeMainBlogAsset,
    deleteBlogAsset,
    changeBlogAssetAlt
} from "@pp/api/panel/blog";
import { range, union, distinctBy } from "@pp/utils/array";
import { ResultType } from "@pp/api/common";
import { ToolTip } from "../common/tooltip";
import { debounce } from "@pp/utils/function";

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
    onSetAsMain: () => void;
    onDelete: () => void;
    isMain: boolean;
}

const OverlayButtons = ({ isMain, onSetAsMain, onDelete }: OverlayButtonProps) => (
    <div className="overlay-button">
        <ToolTip text={isMain ? "Asset is main" : "Set asset as main"}>
            <Icon
                onClick={(e: MouseEvent) => {
                    if (!isMain) onSetAsMain();
                    e.stopPropagation();
                }}
                className={!isMain ? "hideable" : ""}
                icon={isMain ? "star" : "star-o"}
            />
        </ToolTip>
        <ToolTip text="Delete asset">
            <Icon
                onClick={(e: MouseEvent) => {
                    onDelete();
                    e.stopPropagation();
                }}
                className="hideable"
                icon="trash-o"
            />
        </ToolTip>
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
            <Popover {...props} title="Describe the asset">
                <img style={{ width: "400px", height: "400px", objectFit: "cover" }} src={item.url}></img>
                <Form fluid>
                    <FormGroup>
                        <ControlLabel>Description</ControlLabel>
                        <FormControl onChange={this.changeAlt} value={this.state.altText} name="description" />
                    </FormGroup>
                </Form>
            </Popover>
        );
    }
}

interface AssetThumbProps {
    item: BlogAssetsListItem;
    onSetAsMain: (assetId: number) => void;
    onDelete: (assetId: number) => void;
    onAltChange: (assetId: number, alt: string) => void;
}

const AssetThumb = ({ item, onSetAsMain, onDelete, onAltChange }: AssetThumbProps) => {
    return (
        <Whisper placement="auto" speaker={<AssetDescriptor onAltChanged={onAltChange} item={item} />} trigger="click">
            <AssetsListItem className="thumb">
                <OverlayButtons
                    isMain={item.isMain!}
                    onDelete={() => onDelete(item.id!)}
                    onSetAsMain={() => onSetAsMain(item.id!)}
                />
                <img src={item.url}></img>
            </AssetsListItem>
        </Whisper>
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
    const [processing, setProcessing] = React.useState<{ processing: boolean, progress: number }>({ processing: false, progress: 0 });

    React.useEffect(() => {
        uploadBlogAsset(
            blogId,
            item.file!,
            (p) => { console.log(p); setProcessing(p) },
            (res) => {
                console.log('load=end');
                setProcessing({ processing: false, progress: 0 });
                res.type === ResultType.Success && onUpload(res.result!.id, res.result!.url, item.url!);
            }
        );
    }, []);

    return (
        <AssetsListItem className="thumb">
            {processing.processing && <Loader inverse center />}
            {!processing.processing && (
                <Progress.Line strokeWidth={3} showInfo={false} status={"active"} percent={processing.progress} />
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

const AssetsList = ({
    items,
    onAssetsChosen,
    blogId,
    onUploaded,
    onSetAsMain,
    onDelete,
    onAltChange
}: {
    blogId: number;
    items: BlogAssetsListItem[];
    onAssetsChosen: (assets: { url: string; file: File }[]) => void;
    onUploaded: (id: number, url: string, oldURL: string) => void;
    onSetAsMain: (assetId: number) => void;
    onDelete: (assetId: number) => void;
    onAltChange: (assetId: number, alt: string) => void;
}) => (
        <div className="assets-list">
            {items.map((item) =>
                item.id !== undefined ? (
                    <AssetThumb
                        onAltChange={onAltChange}
                        onDelete={onDelete}
                        onSetAsMain={onSetAsMain}
                        item={item}
                        key={item.id}
                    />
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

    handleAltChange = (assetId: number, alt: string) => {
        this.setState((state) => {
            const index = state.assets.map((x) => x.id).indexOf(assetId);

            const item = state.assets[index];

            let assets = [...state.assets.slice(0, index), { ...item, alt }, ...state.assets.slice(index + 1)];

            return { assets };
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
                full
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
                        onAltChange={this.handleAltChange}
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
