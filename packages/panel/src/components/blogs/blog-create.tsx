import * as React from "react";
import {
    Button,
    ButtonToolbar,
    Drawer,
    Form,
    Message,
    useToaster
} from "rsuite";
import { BlogEditDto, createBlog } from "@pp/api/dist/panel/blog";
import { blogModel, emptyBlog } from "./blog-model";
import type { FormInstance } from 'rsuite';
import { ResultType } from "@pp/api/dist/common";
import { translations } from "../../i18n";

interface Props {
    showCreateForm: boolean;
    closeCreateForm: () => void;
    onAdded: () => void;
}

export const BlogCreate = ({ showCreateForm, closeCreateForm, onAdded }: Props) => {
    const [formState, setFormState] = React.useState<BlogEditDto>(emptyBlog());
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [formError, setFormError] = React.useState({});
    const formRef = React.useRef<FormInstance>();
    const toaster = useToaster();

    const submitCreateBlog = async () => {
        if (!formRef.current) return;

        formRef.current.check();
        
        const result = await formRef.current.checkAsync();
        if (result.hasError) return;

        setIsLoading(true);
        createBlog(formState).then((result) => {
            if (result.type === ResultType.Success) {
                toaster.push(
                    <Message type="success">{translations.blog.create.created}</Message>
                );
                setFormState(emptyBlog());
                closeCreateForm();
                onAdded();
            } else {
                toaster.push(
                    <Message type="error">{translations.blog.create.notCreated}</Message>
                );
            }
            setIsLoading(false);
        });
    };

    return (
        <Drawer size="sm" placement="right" open={showCreateForm} onClose={closeCreateForm}>
            <Drawer.Header>
                <Drawer.Title>{translations.blog.create.title}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
                <Form
                    ref={formRef as React.Ref<FormInstance>}
                    model={blogModel()}
                    formValue={formState}
                    formError={formError}
                    onCheck={setFormError}
                    onChange={(x) => setFormState(x as BlogEditDto)}>
                    <Form.Group>
                        <Form.ControlLabel>{translations.blog.create.details.title.label}</Form.ControlLabel>
                        <Form.Control style={{ width: 500 }} name="title" />
                        <Form.HelpText tooltip>{translations.blog.create.details.title.hint}</Form.HelpText>
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>{translations.blog.create.details.alias.label}</Form.ControlLabel>
                        <Form.Control style={{ width: 500 }} name="alias" checkAsync />
                        <Form.HelpText tooltip>{translations.blog.create.details.alias.hint}</Form.HelpText>
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>{translations.blog.create.details.date.label}</Form.ControlLabel>
                        <Form.Control style={{ width: 500 }} name="date" type="date" />
                        <Form.HelpText tooltip>{translations.blog.create.details.date.hint}</Form.HelpText>
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>{translations.blog.create.details.content.label}</Form.ControlLabel>
                        <Form.Control 
                            style={{ width: 500, height: 300 }} 
                            name="content" 
                            as="textarea" 
                        />
                        <Form.HelpText tooltip>{translations.blog.create.details.content.hint}</Form.HelpText>
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>{translations.blog.create.details.tags.label}</Form.ControlLabel>
                        <Form.Control style={{ width: 500 }} name="tags" />
                        <Form.HelpText tooltip>{translations.blog.create.details.tags.hint}</Form.HelpText>
                    </Form.Group>
                    <Form.Group>
                        <ButtonToolbar>
                            <Button onClick={submitCreateBlog} appearance="primary" loading={isLoading}>
                                {translations.blog.create.save}
                            </Button>
                            <Button
                                onClick={() => {
                                    setFormState(emptyBlog());
                                    setIsLoading(false);
                                    closeCreateForm();
                                }}
                                appearance="default">
                                {translations.blog.create.cancel}
                            </Button>
                        </ButtonToolbar>
                    </Form.Group>
                </Form>
            </Drawer.Body>
        </Drawer>
    );
};
