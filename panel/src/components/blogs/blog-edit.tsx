import * as React from 'react';
import { Drawer, Button, Form, FormGroup, ControlLabel, FormControl, HelpBlock, ButtonToolbar, Alert } from 'rsuite';
import { BlogEditDto, editBlog, getBlogForEdit } from '@pp/api/panel/blog';
import { ResultType } from '@pp/api/common';
import { blogModel, emptyBlog } from './blog-model';
import { FormInstance } from 'rsuite/lib/Form/index.d.ts';
import { translations } from '../../i18n';

interface Props {
    id: number;
    showEditForm: boolean;
    closeEditForm: () => void;
    onSaved: () => void;
}

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
                    Alert.success(translations.blog.edit.edited);
                    closeEditForm();
                    onSaved();
                } else {
                    Alert.error(translations.blog.edit.notEdited);
                }
                setIsLoading(false);
            });
        }
    };

    return (
        <Drawer size="sm" placement="right" show={showEditForm} onHide={closeEditForm}>
            <Drawer.Header>
                <Drawer.Title>{translations.blog.edit.title}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
                <Form
                    ref={formRef}
                    model={blogModel(id)}
                    formValue={formState}
                    onChange={(x) => setFormState(x as BlogEditDto)}>
                    <FormGroup>
                        <ControlLabel>{translations.blog.edit.details.title.label}</ControlLabel>
                        <FormControl style={{ width: 500 }} name="title" />
                        <HelpBlock tooltip>{translations.blog.create.details.title.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{translations.blog.edit.details.alias.label}</ControlLabel>
                        <FormControl style={{ width: 500 }} name="alias" checkAsync />
                        <HelpBlock tooltip>{translations.blog.create.details.alias.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{translations.blog.edit.details.date.label}</ControlLabel>
                        <FormControl style={{ width: 500 }} name="date" type="date" />
                        <HelpBlock tooltip>{translations.blog.create.details.date.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{translations.blog.edit.details.content.label}</ControlLabel>
                        <FormControl style={{ width: 500, height: 300 }} name="content" componentClass="textarea" />
                        <HelpBlock tooltip>{translations.blog.create.details.content.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{translations.blog.edit.details.tags.label}</ControlLabel>
                        <FormControl style={{ width: 500 }} name="tags" />
                        <HelpBlock tooltip>{translations.blog.create.details.tags.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
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
                    </FormGroup>
                </Form>
            </Drawer.Body>
        </Drawer>
    );
};
