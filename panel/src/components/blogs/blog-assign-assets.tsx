import React, { ChangeEvent } from "react";
import { Modal, Button, Icon, IconButton, Loader, Progress } from "rsuite";
import { BlogAssetsListItemDto, uploadBlogAsset, getBlogAssets } from "../../../../api/panel/blog";
import { range, union, distinctBy } from "../../../../utils/array";
import { inRange } from "../../../../utils/number";
import { read } from "../../../../utils/file";
import { ResultType } from "../../../../api/common";

type BlogAssetsListItem = Partial<BlogAssetsListItemDto & { file: File }>;

interface Props {
    id: number;
    showBlogAssignAssets: boolean;
    closeAssignAssets: () => void;
}
interface State {
    assets: BlogAssetsListItem[];
}

const BlogAssetThumb = (item: BlogAssetsListItem) => {
    return (
        <AssetsListItem className="thumb">
            <IconButton icon={<Icon icon="close" />} circle size="xs" />
            <img src={item.url}></img>
        </AssetsListItem>
    );
};

const BlogAssetUploadThumb = ({
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
            {/* <img src={item.url}></img> */}
            {processing && <Loader inverse backdrop center />}
            {inRange(0, 100, uploadProgress) && (
                <Progress.Line strokeWidth={3} showInfo={false} status={"active"} percent={uploadProgress} />
            )}
        </AssetsListItem>
    );
};

interface BlogAssetButtonProps {
    onAssetsChosen: (assets: { url: string; file: File }[]) => void;
}

const BlogAssetButton = ({ onAssetsChosen }: BlogAssetButtonProps) => {
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
    onUploaded
}: {
    blogId: number;
    items: BlogAssetsListItem[];
    onAssetsChosen: (assets: { url: string; file: File }[]) => void;
    onUploaded: (id: number, url: string, oldURL: string) => void;
}) => (
    <div className="assets-list">
        {items.map((item) =>
            item.id !== undefined ? (
                <BlogAssetThumb {...item} key={item.id} />
            ) : (
                <BlogAssetUploadThumb
                    blogId={blogId}
                    item={item}
                    key={item.url}
                    onUpload={(id, url, oldURL) => onUploaded(id, url, oldURL)}
                />
            )
        )}
        <BlogAssetButton onAssetsChosen={onAssetsChosen} />
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
                        items={this.state.assets}
                    />
                    {/* <Uploader multiple listType="picture" action="//jsonplaceholder.typicode.com/posts/">
                        <Button>
                            <Icon icon="camera-retro" size="lg" />
                        </Button>
                    </Uploader> */}
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
