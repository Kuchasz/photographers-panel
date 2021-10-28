import React from 'react';
import { Modal, Button } from 'rsuite';
import { BlogAssignAssets, BlogAssignAssetsProps } from './blog-assign-assets';
import { translations } from '../../i18n';

interface BlogAssignAssetsModalProps extends BlogAssignAssetsProps {
    showBlogAssignAssets: boolean;
    closeAssignAssets: () => void;
}

interface BlogAssignAssetsModalState {}

export class BlogAssignAssetsModal extends React.Component<BlogAssignAssetsModalProps, BlogAssignAssetsModalState> {
    constructor(props: BlogAssignAssetsModalProps) {
        super(props);
    }

    handleModalHide = () => {
        this.props.closeAssignAssets();
    };

    render() {
        return (
            <Modal full show={this.props.showBlogAssignAssets} onHide={this.handleModalHide}>
                <Modal.Header>
                    <Modal.Title>{translations.blog.assignAssets.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <BlogAssignAssets id={this.props.id} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.closeAssignAssets} appearance="primary">
                        {translations.blog.assignAssets.ok}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
