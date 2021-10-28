import * as React from 'react';
import { confirmable, createConfirmation } from 'react-confirm';
import { Modal, Button } from 'rsuite';

interface ConfirmationProps {
    confirmation: string;
    proceed: (x: boolean) => void;
    options: { title: string };
    show: boolean;
}

const ConfirmationComponent = (props: ConfirmationProps) => (
    <Modal backdrop={true} show={props.show} onHide={() => props.proceed(false)}>
        <Modal.Header>
            <Modal.Title>{props.options.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.confirmation}</Modal.Body>
        <Modal.Footer>
            <Button onClick={() => props.proceed(true)} appearance="primary">
                Ok
            </Button>
            <Button onClick={() => props.proceed(false)} appearance="subtle">
                Cancel
            </Button>
        </Modal.Footer>
    </Modal>
);

const Confirmation = confirmable(ConfirmationComponent);

const confirmInternal = createConfirmation(Confirmation);

export const confirm = (text: string, title: string) => {
    return confirmInternal({ confirmation: text, options: { title } });
};
