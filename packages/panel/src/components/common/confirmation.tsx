import * as React from 'react';
import { confirmable, createConfirmation, ConfirmDialog } from 'react-confirm';
import { Modal, Button } from 'rsuite';

interface ConfirmationProps {
    confirmation: string;
    proceedLabel?: string;
    cancelLabel?: string;
    title?: string;
    show: boolean;
    proceed: (value: boolean) => void;
    dismiss: () => void;
    cancel: () => void;
}

const ConfirmationComponent: ConfirmDialog<ConfirmationProps, boolean> = ({
    show,
    proceed,
    dismiss,
    cancel,
    confirmation,
    title = 'Confirm',
    proceedLabel = 'Ok',
    cancelLabel = 'Cancel'
}) => (
    <Modal backdrop={true} open={show} onClose={dismiss}>
        <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{confirmation}</Modal.Body>
        <Modal.Footer>
            <Button onClick={() => proceed(true)} appearance="primary">
                {proceedLabel}
            </Button>
            <Button onClick={cancel} appearance="subtle">
                {cancelLabel}
            </Button>
        </Modal.Footer>
    </Modal>
);

const Confirmation = confirmable(ConfirmationComponent);

const confirmInternal = createConfirmation(Confirmation);

export const confirm = (text: string, title: string) => {
    return confirmInternal({
        confirmation: text,
        title,
        proceedLabel: 'Ok',
        cancelLabel: 'Cancel',
        show: true,
        proceed: (value: boolean) => {
            console.log(value);
        },
        dismiss: () => { },
        cancel: () => { }
    });
};
