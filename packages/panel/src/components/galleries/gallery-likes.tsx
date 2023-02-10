import React from 'react';
import { Button, List, Modal } from 'rsuite';
import { GalleryEmailDto, getGalleryForEdit } from '@pp/api/dist/panel/private-gallery';
import { translations } from '../../i18n';
import { createGraphApi, GraphApi } from '../../graph-api';
import { LikedPhoto } from '../../sdk';

interface Props {
    id: number;
    show: boolean;
    close: () => void;
    onNotified: () => void;
}
interface State {
    likedPhotos: LikedPhoto[];
    directPath?: string;
}

const LikedPhotoList = ({ likedPhotos }: { likedPhotos: LikedPhoto[] }) => (
    <div className="likes-list">
        <List>
            {likedPhotos.map((lp) => (
                <List.Item key={lp.fileName}>{lp.fileName} - {lp.likes}</List.Item>
            ))}
        </List>
    </div>
);

export class GalleryLikes extends React.Component<Props, State> {
    private api: GraphApi;

    constructor(props: Props) {
        super(props);
        this.state = { likedPhotos: [] };
        this.api = createGraphApi('', props.id);
    }

    componentDidMount() {
        Promise.all([this.api.likedPhotos({ galleryId: this.props.id }), getGalleryForEdit(this.props.id)]).then(
            ([likedPhotosResult, gallery]) => {
                this.setState({ likedPhotos: likedPhotosResult.likedPhotos, directPath: gallery.directPath });
            }
        );
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.id === prevProps.id) return;
        // getGalleryEmails(this.props.id).then(({ emails, pendingNotification }) => {
        //     this.setState({ emails, pendingNotification });
        // });
    }

    handleModalHide = () => {
        this.props.close();
    };

    render() {
        return (
            <Modal className="gallery-likes" show={this.props.show} onHide={this.handleModalHide}>
                <Modal.Header>
                    <Modal.Title>{translations.gallery.likesBrowser.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LikedPhotoList likedPhotos={this.state.likedPhotos} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleModalHide} appearance="subtle">
                        {translations.gallery.likesBrowser.cancel}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
