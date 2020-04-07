import React from "react";
import { Modal, Button, Icon, IconButton } from "rsuite";
import { BlogAssetsListItemDto } from "../../../../api/panel/blog";

interface Props {
    id: number;
    showBlogAssignAssets: boolean;
    closeAssignAssets: () => void;
}
interface State {}

const BlogAssetThumb = (item: BlogAssetsListItemDto) => (
    <AssetsListItem className="thumb">
        <IconButton icon={<Icon icon="close" />} circle size="xs" />
        <img src={item.url}></img>
    </AssetsListItem>
);

const BlogAssetButton = () => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const triggerFileSelect = () => {
        inputRef.current?.click();
    };

    return (
        <AssetsListItem className="add-btn">
            <>
                <Button appearance="subtle" onClick={triggerFileSelect}>
                    <Icon icon="camera-retro" size="lg"></Icon>
                </Button>
                <input ref={inputRef} type="file" accept="image/*" multiple></input>
            </>
        </AssetsListItem>
    );
};
const AssetsListItem: React.FC<{ className: string }> = ({ children, className }) => (
    <div className={`item ${className}`}>{children}</div>
);

const AssetsList = ({ items }: { items: BlogAssetsListItemDto[] }) => (
    <div className="assets-list">
        {items.map((item) => (
            <BlogAssetThumb {...item} key={item.id} />
        ))}
        <BlogAssetButton />
    </div>
);

const items = [
    { id: 0, url: "https://picsum.photos/100/200" },
    { id: 7, url: "https://picsum.photos/100" },
    { id: 6, url: "https://picsum.photos/100/300" },
    { id: 5, url: "https://picsum.photos/100" },
    { id: 4, url: "https://picsum.photos/100/200" },
    { id: 3, url: "https://picsum.photos/100/150" },
    { id: 2, url: "https://picsum.photos/100" },
    { id: 1, url: "https://picsum.photos/100" },
    { id: 8, url: "https://picsum.photos/100" },
    { id: 9, url: "https://picsum.photos/100" },
    { id: 10, url: "https://picsum.photos/100" },
    { id: 11, url: "https://picsum.photos/100" },
    { id: 12, url: "https://picsum.photos/100" },
    { id: 13, url: "https://picsum.photos/100" },
    { id: 14, url: "https://picsum.photos/100" },
    { id: 15, url: "https://picsum.photos/100" },
    { id: 16, url: "https://picsum.photos/100" },
    { id: 17, url: "https://picsum.photos/100" },
    { id: 18, url: "https://picsum.photos/100" }
];

export class BlogAssignAssets extends React.Component<Props, State> {
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
                    <AssetsList items={items} />
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
