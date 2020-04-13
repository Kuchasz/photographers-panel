import React, { ChangeEvent } from "react";
import { Modal, Button, Icon, IconButton, Loader, Progress } from "rsuite";
import { BlogAssetsListItemDto, uploadBlogAsset } from "../../../../api/panel/blog";
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
    onUpload(id: number): void;
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
                res.type === ResultType.Success && onUpload(res.result!.id);
            }
        );
    }, []);

    return (
        <AssetsListItem className="thumb">
            <img src={item.url}></img>
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
    onUploaded: (id: number, url: string) => void;
}) => (
    <div className="assets-list">
        {items.map((item) =>
            item.id ? (
                <BlogAssetThumb {...item} key={item.id} />
            ) : (
                <BlogAssetUploadThumb
                    blogId={blogId}
                    item={item}
                    key={item.url}
                    onUpload={(id) => onUploaded(id, item.url!)}
                />
            )
        )}
        <BlogAssetButton onAssetsChosen={onAssetsChosen} />
    </div>
);

const items = [
    { id: 0, url: "https://picsum.photos/122/200" },
    { id: 7, url: "https://picsum.photos/100" },
    { id: 6, url: "https://picsum.photos/100/350" },
    { id: 5, url: "https://picsum.photos/100/150" },
    { id: 4, url: "https://picsum.photos/100/250" },
    { id: 3, url: "https://picsum.photos/100/300" },
    { id: 2, url: "https://picsum.photos/150/100" },
    { id: 1, url: "https://picsum.photos/150/150" },
    { id: 8, url: "https://picsum.photos/150/200" },
    { id: 9, url: "https://picsum.photos/150/250" },
    { id: 10, url: "https://picsum.photos/150/300" },
    { id: 11, url: "https://picsum.photos/200" },
    { id: 12, url: "https://picsum.photos/200/100" },
    { id: 13, url: "https://picsum.photos/200/150" },
    { id: 14, url: "https://picsum.photos/200/200" },
    { id: 15, url: "https://picsum.photos/200/250" },
    { id: 16, url: "https://picsum.photos/200/300" },
    { id: 17, url: "https://picsum.photos/250/100" },
    { id: 18, url: "https://picsum.photos/250/150" }
];

export class BlogAssignAssets extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { assets: items };
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

    handleAssetsUploaded = (id: number, url: string) => {
        this.setState((state) => {
            const cindex = state.assets.map((x) => x.url).indexOf(url);
            const assets = [...state.assets.slice(0, cindex), { id, url }, ...state.assets.slice(cindex + 1)];
            return { assets };
        });
    };

    handleModalHide = () => {
        this.props.closeAssignAssets();
        this.setState(() => ({ assets: items }));
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
