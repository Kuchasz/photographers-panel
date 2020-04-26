import * as React from "react";
import { Drawer, Button, Form, FormGroup, ControlLabel, FormControl, HelpBlock, ButtonToolbar, Alert } from "rsuite";
import { BlogEditDto, editBlog, getBlogForEdit } from "../../../../api/panel/blog";
import { FormInstance } from "rsuite/lib/Form/Form";
import { ResultType } from "../../../../api/common";
import { blogModel } from "./blog-model";

interface Props {
    id: number;
    showEditForm: boolean;
    closeEditForm: () => void;
    onSaved: () => void;
}

export const emptyBlog = (): BlogEditDto => ({
    title: "",
    alias: "",
    date: "",
    content: ""
});

export const BlogEdit = ({ id, showEditForm, closeEditForm, onSaved }: Props) => {
    const [formState, setFormState] = React.useState<BlogEditDto>(emptyBlog());
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const formRef = React.useRef<FormInstance>();

    React.useEffect(() => {
        getBlogForEdit(id).then(setFormState);
    }, [id]);

    const submitEditBlog = async () => {
        if (formRef.current) {
            const result = await formRef.current.checkAsync();
            if (result.hasError) return;
            setIsLoading(true);
            editBlog(id, formState).then((result) => {
                if (result.type === ResultType.Success) {
                    Alert.success("Blog successfully edited.");
                    closeEditForm();
                    onSaved();
                } else {
                    Alert.error("An error occured while editing blog.");
                }
                setIsLoading(false);
            });
        }
    };

    return (
        <Drawer size="xs" placement="right" show={showEditForm} onHide={closeEditForm}>
            <Drawer.Header>
                <Drawer.Title>Edit blog</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
                <Form
                    ref={formRef}
                    model={blogModel(id)}
                    formValue={formState}
                    onChange={(x) => setFormState(x as BlogEditDto)}
                >
                    <FormGroup>
                        <ControlLabel>Title</ControlLabel>
                        <FormControl name="title" />
                        <HelpBlock tooltip>Title of the blog</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Alias</ControlLabel>
                        <FormControl name="alias" checkAsync />
                        <HelpBlock tooltip>Alias of the blog</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Date</ControlLabel>
                        <FormControl name="date" type="date" />
                        <HelpBlock tooltip>Date of the blog</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Content</ControlLabel>
                        <FormControl name="content" componentClass="textarea" />
                        <HelpBlock tooltip>Content of blog</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ButtonToolbar>
                            <Button onClick={submitEditBlog} appearance="primary" loading={isLoading}>
                                Save
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsLoading(false);
                                    closeEditForm();
                                }}
                                appearance="default"
                            >
                                Cancel
                            </Button>
                        </ButtonToolbar>
                    </FormGroup>
                </Form>
            </Drawer.Body>
        </Drawer>
    );
};
