import React
    // , { ChangeEvent } 
    from "react";
import {
    Modal,
    Button,
    List,
    Icon,
    // Loader,
    // Progress,
    Alert,
    // Whisper,
    // Popover,
    // FormGroup,
    // ControlLabel,
    // FormControl,
    // Form
} from "rsuite";

import {
    notifySubscribers,
    getGalleryEmails,
    GalleryEmailDto
} from "@pp/api/panel/private-gallery";
import { ToolTip } from "../common/tooltip";
import { ResultType } from "@pp/api/common";
// import { range, union, distinctBy } from "@pp/utils/array";
// import { ResultType } from "@pp/api/common";
// import { ToolTip } from "../common/tooltip";

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
    return [userPart.slice(0, 3) + "*".repeat(userPart.length - 3), domainPart].join("@");
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
            Alert.success("Subscribers notified.");
            this.handleModalHide();
            this.props.onNotified();
        } else {
            Alert.error("An error occured while editing gallery.");
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
                    <Modal.Title>Send email notifications</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EmailsList
                        emails={this.state.emails}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <ToolTip placement="left" text="Click to notify subscribers about gallery being available">
                        <Button onClick={this.notifySubscribers} disabled={!this.state.pendingNotification} appearance="primary" loading={this.state.isLoading}>
                            <Icon icon="bell-o" /> Send notification
                    </Button>
                    </ToolTip>
                    <Button onClick={this.handleModalHide} appearance="subtle">
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
