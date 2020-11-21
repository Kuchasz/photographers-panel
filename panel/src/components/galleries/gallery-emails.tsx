import React
    // , { ChangeEvent } 
    from "react";
import {
    Modal,
    Button,
    List
    // Icon,
    // Loader,
    // Progress,
    // Alert,
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
// import { range, union, distinctBy } from "@pp/utils/array";
// import { ResultType } from "@pp/api/common";
// import { ToolTip } from "../common/tooltip";
// import { debounce } from "@pp/utils/function";

interface Props {
    id: number;
    show: boolean;
    close: () => void;
}
interface State {
    emails: GalleryEmailDto[];
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
        this.state = { emails: [], isLoading: false };
    }

    componentDidMount() {
        getGalleryEmails(this.props.id).then(({ emails }) => {
            this.setState({ emails });
        });
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.id === prevProps.id) return;
        getGalleryEmails(this.props.id).then(({ emails }) => {
            this.setState({ emails });
        });
    }

    handleModalHide = () => {
        this.props.close();
    };

    notifySubscribers = async () => {
        this.setState({ isLoading: true });
        await notifySubscribers(this.props.id);
        this.setState({ isLoading: false });
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
                    <Button onClick={this.notifySubscribers} appearance="primary" loading={this.state.isLoading}>
                        Notify users
                    </Button>
                    <Button onClick={this.handleModalHide} appearance="subtle">
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
