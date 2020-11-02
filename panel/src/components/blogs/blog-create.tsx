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
    Alert
} from "rsuite";
import { BlogEditDto, createBlog } from "@pp/api/panel/blog";
import { ResultType } from "@pp/api/common";
import { blogModel, emptyBlog } from "./blog-model";
import { FormInstance } from "rsuite/lib/Form/index.d.ts";

interface Props {
    showCreateForm: boolean;
    closeCreateForm: () => void;
    onAdded: () => void;
}

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
        <Drawer size="sm" placement="right" show={showCreateForm} onHide={closeCreateForm}>
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
                        <FormControl style={{width: 500}} name="title" />
                        <HelpBlock tooltip>Title of the blog</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Alias</ControlLabel>
                        <FormControl style={{width: 500}} name="alias" checkAsync />
                        <HelpBlock tooltip>Alias of the blog</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Date</ControlLabel>
                        <FormControl style={{width: 500}} name="date" type="date" />
                        <HelpBlock tooltip>Date of the blog</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Content</ControlLabel>
                        <FormControl style={{width: 500, height: 300}} name="content" componentClass="textarea" />
                        <HelpBlock tooltip>Content of blog</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Tags</ControlLabel>
                        <FormControl style={{width: 500}} name="tags" />
                        <HelpBlock tooltip>Tags of the blog</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ButtonToolbar>
                            <Button onClick={submitCreateBlog} appearance="primary" loading={isLoading}>
                                Save
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
