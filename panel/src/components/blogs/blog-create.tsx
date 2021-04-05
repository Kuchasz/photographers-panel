import * as React from 'react';
import { Drawer, Button, Form, FormGroup, ControlLabel, FormControl, HelpBlock, ButtonToolbar, Alert } from 'rsuite';
import { BlogEditDto, createBlog } from '@pp/api/panel/blog';
import { ResultType } from '@pp/api/common';
import { blogModel, emptyBlog } from './blog-model';
import { FormInstance } from 'rsuite/lib/Form/index.d.ts';
import { translations } from '../../i18n';

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
                    Alert.success(translations.blog.create.created);
                    setFormState(emptyBlog());
                    closeCreateForm();
                    onAdded();
                } else {
                    Alert.error(translations.blog.create.notCreated);
                }
                setIsLoading(false);
            });
        }
    };

    return (
        <Drawer size="sm" placement="right" show={showCreateForm} onHide={closeCreateForm}>
            <Drawer.Header>
                <Drawer.Title>{translations.blog.create.title}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
                <Form
                    ref={formRef}
                    model={blogModel()}
                    formValue={formState}
                    onChange={(x) => setFormState(x as BlogEditDto)}>
                    <FormGroup>
                        <ControlLabel>{translations.blog.create.details.title.label}</ControlLabel>
                        <FormControl style={{ width: 500 }} name="title" />
                        <HelpBlock tooltip>{translations.blog.create.details.title.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{translations.blog.create.details.alias.label}</ControlLabel>
                        <FormControl style={{ width: 500 }} name="alias" checkAsync />
                        <HelpBlock tooltip>{translations.blog.create.details.alias.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{translations.blog.create.details.date.label}</ControlLabel>
                        <FormControl style={{ width: 500 }} name="date" type="date" />
                        <HelpBlock tooltip>{translations.blog.create.details.date.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{translations.blog.create.details.content.label}</ControlLabel>
                        <FormControl style={{ width: 500, height: 300 }} name="content" componentClass="textarea" />
                        <HelpBlock tooltip>{translations.blog.create.details.content.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{translations.blog.create.details.tags.label}</ControlLabel>
                        <FormControl style={{ width: 500 }} name="tags" />
                        <HelpBlock tooltip>{translations.blog.create.details.tags.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
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
                    </FormGroup>
                </Form>
            </Drawer.Body>
        </Drawer>
    );
};
