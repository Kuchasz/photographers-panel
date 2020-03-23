import * as React from "react";
import { Modal, Button } from "rsuite";

interface ConfirmationProps {
    title: string;
    text: string;
    onAccept: () => void;
    onReject: () => void;
    show: boolean;
}

export const Confirmation = (props: ConfirmationProps) => (
    <Modal backdrop={true} show={props.show} onHide={props.onReject}>
        <Modal.Header>
            <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.text}</Modal.Body>
        <Modal.Footer>
            <Button onClick={props.onAccept} appearance="primary">
                Ok
            </Button>
            <Button onClick={props.onReject} appearance="subtle">
                Cancel
            </Button>
        </Modal.Footer>
    </Modal>
);
