import * as React from "react";
import {
    Drawer,
    Button,
    Form,
    FormGroup,
    ControlLabel,
    FormControl,
    HelpBlock,
    ButtonToolbar,
    Alert,
    Icon
} from "rsuite";
import { BlogEditDto, createBlog } from "../../../../api/panel/blog";
import { FormInstance } from "rsuite/lib/Form/Form";
import { ResultType } from "../../../../api/common";
import { blogModel } from "./blog-model";

interface Props {
    showCreateForm: boolean;
    closeCreateForm: () => void;
    onAdded: () => void;
}

export const emptyBlog = (): BlogEditDto => ({
    title: "",
    alias: "",
    date: "",
    content: ""
});

export const BlogCreate = ({ showCreateForm, closeCreateForm, onAdded }: Props) => {
    const [formState, setFormState] = React.useState<BlogEditDto>(emptyBlog());
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const formRef = React.useRef<FormInstance>();

    const submitCreateBlog = async () => {
        if (formRef.current) {
            const result = await formRef.current.checkAsync();
            if (result.hasError) return;
            setIsLoading(true);
            createBlog(formState).then((result) => {
                if (result.type === ResultType.Success) {
                    Alert.success("Blog successfully added.");
                    setFormState(emptyBlog());
                    closeCreateForm();
                    onAdded();
                } else {
                    Alert.error("An error occured while adding blog.");
                }
                setIsLoading(false);
            });
        }
    };

    return (
        <Drawer size="xs" placement="right" show={showCreateForm} onHide={closeCreateForm}>
            <Drawer.Header>
                <Drawer.Title>Create new blog</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
                <Form
                    ref={formRef}
                    model={blogModel()}
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
                            <Button onClick={submitCreateBlog} appearance="primary" loading={isLoading}>
                                <Icon icon="edit2" />
                                Create
                            </Button>
                            <Button
                                onClick={() => {
                                    setFormState(emptyBlog());
                                    setIsLoading(false);
                                    closeCreateForm();
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