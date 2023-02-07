import React from 'react';
import { Button, List, Modal } from 'rsuite';
import { GalleryEmailDto, getGalleryEmails } from '@pp/api/dist/panel/private-gallery';
import { translations } from '../../i18n';
import { createGraphApi, GraphApi } from '../../graph-api';

interface Props {
    id: number;
    show: boolean;
    close: () => void;
    onNotified: () => void;
}
interface State {
    emails: GalleryEmailDto[];
}

const EmailsList = ({ emails }: { emails: GalleryEmailDto[] }) => (
    <div className="likes-list">
        <List>
            {emails.map((email) => (
                <List.Item key={email.address}>{email.address}</List.Item>
            ))}
        </List>
    </div>
);

export class GalleryLikes extends React.Component<Props, State> {
    private api: GraphApi;

    constructor(props: Props) {
        super(props);
        this.state = { emails: [] };
        this.api = createGraphApi('', props.id);
    }

    componentDidMount() {
        this.api.likedPhotos({ galleryId: this.props.id }).then((r) => console.log(r.likedPhotos));
        // getGalleryEmails(this.props.id).then(({ emails, pendingNotification }) => {
        //     this.setState({ emails, pendingNotification });
        // });
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
                    <EmailsList emails={this.state.emails} />
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
