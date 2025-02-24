import * as React from "react";
import {
    Button,
    ButtonToolbar,
    Drawer,
    Form,
    Message,
    useToaster
} from "rsuite";
import { BlogEditDto, editBlog, getBlogForEdit } from "@pp/api/dist/panel/blog";
import { blogModel, emptyBlog } from "./blog-model";
import type { FormInstance } from 'rsuite';
import { ResultType } from "@pp/api/dist/common";
import { translations } from "../../i18n";

interface Props {
    id: number;
    showEditForm: boolean;
    closeEditForm: () => void;
    onSaved: () => void;
}

export const BlogEdit = ({ id, showEditForm, closeEditForm, onSaved }: Props) => {
    const [formState, setFormState] = React.useState<BlogEditDto>(emptyBlog());
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [formError, setFormError] = React.useState({});
    const formRef = React.useRef<FormInstance>();
    const toaster = useToaster();

    React.useEffect(() => {
        getBlogForEdit(id).then(setFormState);
    }, [id]);

    const submitEditBlog = async () => {
        if (!formRef.current) return;

        formRef.current.check();
        
        const result = await formRef.current.checkAsync();
        if (result.hasError) return;

        setIsLoading(true);
        editBlog(id, formState).then((result) => {
            if (result.type === ResultType.Success) {
                toaster.push(
                    <Message type="success">{translations.blog.edit.edited}</Message>
                );
                closeEditForm();
                onSaved();
            } else {
                toaster.push(
                    <Message type="error">{translations.blog.edit.notEdited}</Message>
                );
            }
            setIsLoading(false);
        });
    };

    return (
        <Drawer size="sm" placement="right" open={showEditForm} onClose={closeEditForm}>
            <Drawer.Header>
                <Drawer.Title>{translations.blog.edit.title}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
                <Form
                    ref={formRef}
                    model={blogModel(id)}
                    formValue={formState}
                    formError={formError}
                    onCheck={setFormError}
                    onChange={(x) => setFormState(x as BlogEditDto)}>
                    <Form.Group>
                        <Form.ControlLabel>{translations.blog.edit.details.title.label}</Form.ControlLabel>
                        <Form.Control style={{ width: 500 }} name="title" />
                        <Form.HelpText tooltip>{translations.blog.create.details.title.hint}</Form.HelpText>
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>{translations.blog.edit.details.alias.label}</Form.ControlLabel>
                        <Form.Control style={{ width: 500 }} name="alias" checkAsync />
                        <Form.HelpText tooltip>{translations.blog.create.details.alias.hint}</Form.HelpText>
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>{translations.blog.edit.details.date.label}</Form.ControlLabel>
                        <Form.Control style={{ width: 500 }} name="date" type="date" />
                        <Form.HelpText tooltip>{translations.blog.create.details.date.hint}</Form.HelpText>
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>{translations.blog.edit.details.content.label}</Form.ControlLabel>
                        <Form.Control 
                            style={{ width: 500, height: 300 }} 
                            name="content" 
                            as="textarea" 
                        />
                        <Form.HelpText tooltip>{translations.blog.create.details.content.hint}</Form.HelpText>
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>{translations.blog.edit.details.tags.label}</Form.ControlLabel>
                        <Form.Control style={{ width: 500 }} name="tags" />
                        <Form.HelpText tooltip>{translations.blog.create.details.tags.hint}</Form.HelpText>
                    </Form.Group>
                    <Form.Group>
                        <ButtonToolbar>
                            <Button onClick={submitEditBlog} appearance="primary" loading={isLoading}>
                                {translations.blog.edit.save}
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsLoading(false);
                                    closeEditForm();
                                }}
                                appearance="default">
                                {translations.blog.edit.cancel}
                            </Button>
                        </ButtonToolbar>
                    </Form.Group>
                </Form>
            </Drawer.Body>
        </Drawer>
    );
};
