import React, { ChangeEvent } from "react";
import { Modal, Button, Icon, IconButton, Loader, Progress } from "rsuite";
import { BlogAssetsListItemDto } from "../../../../api/panel/blog";
import { range } from "../../../../utils/array";
import { readUrl } from "../../../../utils/file";

type BlogAssetsListItem = Partial<BlogAssetsListItemDto>;

interface Props {
    id: number;
    showBlogAssignAssets: boolean;
    closeAssignAssets: () => void;
}
interface State {
    assets: BlogAssetsListItem[];
}

const BlogAssetThumb = (item: BlogAssetsListItem) => {
    const [processing, setProcessing] = React.useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = React.useState<number | undefined>(undefined);

    if (item.id === undefined) {
        React.useEffect(() => {
            let curr = 0;
            const fff = setInterval(() => {
                if (curr === 100) {
                    clearInterval(fff);
                    setUploadProgress(undefined);
                    setProcessing(true);
                    setTimeout(() => {
                        setProcessing(false);
                    }, 2000);
                } else {
                    setUploadProgress((curr += 5));
                }
            }, 150);
        }, []);
    }

    console.log(uploadProgress);

    return (
        <AssetsListItem className="thumb">
            {!processing && !uploadProgress && <IconButton icon={<Icon icon="close" />} circle size="xs" />}
            <img src={item.url}></img>
            {processing && <Loader inverse backdrop center />}
            {uploadProgress && (
                <Progress.Line strokeWidth={3} showInfo={false} status={"active"} percent={uploadProgress} />
            )}
        </AssetsListItem>
    );
};

const BlogAssetButton = ({ onAssetsChosen }: { onAssetsChosen: (assets: string[]) => void }) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const triggerFileSelect = () => {
        inputRef.current?.click();
    };

    const handleFilesChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ?? new FileList();
        const res = await Promise.all(range(files.length).map((x) => readUrl(files[x])));
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
    onAssetsChosen
}: {
    items: BlogAssetsListItem[];
    onAssetsChosen: (assets: string[]) => void;
}) => (
    <div className="assets-list">
        {items.map((item) => (
            <BlogAssetThumb {...item} key={item.url} />
        ))}
        <BlogAssetButton onAssetsChosen={onAssetsChosen} />
    </div>
);

const items = [
    { id: 0, url: "https://picsum.photos/122/200", uploadProgress: 77 },
    { id: 7, url: "https://picsum.photos/100" },
    { id: 6, url: "https://picsum.photos/100/350", uploadProgress: 12 },
    { id: 5, url: "https://picsum.photos/100/150" },
    { id: 4, url: "https://picsum.photos/100/250", processing: true },
    { id: 3, url: "https://picsum.photos/100/300" },
    { id: 2, url: "https://picsum.photos/150/100" },
    { id: 1, url: "https://picsum.photos/150/150" },
    { id: 8, url: "https://picsum.photos/150/200", processing: true },
    { id: 9, url: "https://picsum.photos/150/250", processing: true },
    { id: 10, url: "https://picsum.photos/150/300" },
    { id: 11, url: "https://picsum.photos/200" },
    { id: 12, url: "https://picsum.photos/200/100", uploadProgress: 33 },
    { id: 13, url: "https://picsum.photos/200/150" },
    { id: 14, url: "https://picsum.photos/200/200", processing: true },
    { id: 15, url: "https://picsum.photos/200/250", processing: true },
    { id: 16, url: "https://picsum.photos/200/300" },
    { id: 17, url: "https://picsum.photos/250/100" },
    { id: 18, url: "https://picsum.photos/250/150" }
];

export class BlogAssignAssets extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { assets: items };
    }

    handleNewAssets = (assets: string[]) => {
        this.setState((state) => {
            return { assets: [...state.assets, ...assets.map((x) => ({ url: x }))] };
        });
    };

    render() {
        return (
            <Modal
                className="blog-assign-assets"
                size={"lg"}
                show={this.props.showBlogAssignAssets}
                onHide={this.props.closeAssignAssets}
            >
                <Modal.Header>
                    <Modal.Title>Assign blog assets</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AssetsList onAssetsChosen={this.handleNewAssets} items={this.state.assets} />
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
                    <Button onClick={this.props.closeAssignAssets} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
