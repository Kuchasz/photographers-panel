import React from "react";
import {
    Modal,
    Button,
    List,
    Icon,
    Alert,
} from "rsuite";

import {
    notifySubscribers,
    getGalleryEmails,
    GalleryEmailDto
} from "@pp/api/panel/private-gallery";
import { ToolTip } from "../common/tooltip";
import { ResultType } from "@pp/api/common";
import { translations } from "../../i18n";
import { trim } from "@pp/utils/string";

interface Props {
    id: number;
    show: boolean;
    close: () => void;
    onNotified: () => void;
}
interface State {
    emails: GalleryEmailDto[];
    pendingNotification: boolean;
    isLoading: boolean;
}

const formatEmail = (address: string) => {
    const [userPart, domainPart] = address.split("@");
    return [trim(3, userPart) + "*".repeat(userPart.length - 3), domainPart].join("@");
};

const EmailsList = ({ emails }: { emails: GalleryEmailDto[] }) => (
    <div className="emails-list">
        <List>
            {emails.map((email) => (
                <List.Item key={email.address}>
                    {formatEmail(email.address)}
                </List.Item>
            ))}
        </List>
    </div>
);

export class GalleryEmails extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { emails: [], pendingNotification: false, isLoading: false };
    }

    componentDidMount() {
        getGalleryEmails(this.props.id).then(({ emails, pendingNotification }) => {
            this.setState({ emails, pendingNotification });
        });
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.id === prevProps.id) return;
        getGalleryEmails(this.props.id).then(({ emails, pendingNotification }) => {
            this.setState({ emails, pendingNotification });
        });
    }

    handleModalHide = () => {
        this.props.close();
    };

    notifySubscribers = async () => {
        this.setState({ isLoading: true });
        const result = await notifySubscribers(this.props.id);

        if (result.type === ResultType.Success) {
            Alert.success(translations.gallery.emailNotifications.notified);
            this.handleModalHide();
            this.props.onNotified();
        } else {
            Alert.error(translations.gallery.emailNotifications.notNotified);
        }
        
        this.setState({ isLoading: false, pendingNotification: false });
    }

    render() {
        return (
            <Modal
                className="gallery-emails"
                show={this.props.show}
                onHide={this.handleModalHide}
            >
                <Modal.Header>
        <Modal.Title>{translations.gallery.emailNotifications.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EmailsList
                        emails={this.state.emails}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <ToolTip placement="left" text={translations.gallery.emailNotifications.notifyTooltip}>
                        <Button onClick={this.notifySubscribers} disabled={!this.state.pendingNotification} appearance="primary" loading={this.state.isLoading}>
                            <Icon icon="bell-o" /> {translations.gallery.emailNotifications.send}
                    </Button>
                    </ToolTip>
                    <Button onClick={this.handleModalHide} appearance="subtle">
                    {translations.gallery.emailNotifications.cancel}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
