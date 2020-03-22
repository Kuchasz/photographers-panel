import * as React from "react";
import { Drawer, Button } from "rsuite";

interface Props {
    showCreateForm: boolean;
    closeCreateForm: () => void;
}

export const GalleryCreate = ({ showCreateForm, closeCreateForm }: Props) => (
    <Drawer size="md" placement="right" show={showCreateForm} onHide={closeCreateForm}>
        <Drawer.Header>
            <Drawer.Title>Create new gallery</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body></Drawer.Body>
        <Drawer.Footer>
            <Button onClick={closeCreateForm} appearance="primary">
                Confirm
            </Button>
            <Button onClick={closeCreateForm} appearance="subtle">
                Cancel
            </Button>
        </Drawer.Footer>
    </Drawer>
);
