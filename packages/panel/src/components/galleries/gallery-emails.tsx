import React, { useState, useEffect } from "react";
import {
    Button,
    List,
    Message,
    Modal,
    useToaster
} from "rsuite";
import { GalleryEmailDto, getGalleryEmails, notifySubscribers } from "@pp/api/dist/panel/private-gallery";
import { ResultType } from "@pp/api/dist/common";
import { ToolTip } from "../common/tooltip";
import { translations } from "../../i18n";
import { trim } from "@pp/utils/dist/string";
import { Bell } from "@phosphor-icons/react";

interface Props {
    id: number;
    show: boolean;
    close: () => void;
    onNotified: () => void;
}

const formatEmail = (address: string) => {
    const [userPart, domainPart] = address.split('@');
    return [trim(3, userPart) + '*'.repeat(userPart.length - 3), domainPart].join('@');
};

const EmailsList = ({ emails }: { emails: GalleryEmailDto[] }) => (
    <div className="emails-list">
        <List>
            {emails.map((email) => (
                <List.Item key={email.address}>{formatEmail(email.address)}</List.Item>
            ))}
        </List>
    </div>
);

export const GalleryEmails = ({ id, show, close, onNotified }: Props) => {
    const [emails, setEmails] = useState<GalleryEmailDto[]>([]);
    const [pendingNotification, setPendingNotification] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const toaster = useToaster();

    const fetchEmails = () => {
        getGalleryEmails(id).then(({ emails, pendingNotification }) => {
            setEmails(emails);
            setPendingNotification(pendingNotification);
        });
    };

    useEffect(() => {
        if (show) {
            fetchEmails();
        }
    }, [id, show]);

    const handleModalHide = () => {
        close();
    };

    const notifySubscriberss = async () => {
        setIsLoading(true);
        const result = await notifySubscribers(id);

        if (result.type === ResultType.Success) {
            toaster.push(
                <Message type="success">{translations.gallery.emailNotifications.notified}</Message>
            );
            handleModalHide();
            onNotified();
        } else {
            toaster.push(
                <Message type="error">{translations.gallery.emailNotifications.notNotified}</Message>
            );
        }

        setIsLoading(false);
        setPendingNotification(false);
    };

    return (
        <Modal className="gallery-emails" open={show} onClose={handleModalHide}>
            <Modal.Header>
                <Modal.Title>{translations.gallery.emailNotifications.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <EmailsList emails={emails} />
            </Modal.Body>
            <Modal.Footer>
                <ToolTip placement="left" text={translations.gallery.emailNotifications.notifyTooltip}>
                    <Button
                        onClick={notifySubscriberss}
                        disabled={!pendingNotification}
                        appearance="primary"
                        loading={isLoading}>
                        <Bell size={16} /> {translations.gallery.emailNotifications.send}
                    </Button>
                </ToolTip>
                <Button onClick={handleModalHide} appearance="subtle">
                    {translations.gallery.emailNotifications.cancel}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
