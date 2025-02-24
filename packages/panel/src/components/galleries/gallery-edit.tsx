import * as React from "react";
import { BlogSelectItem, getBlogSelectList } from "@pp/api/dist/panel/blog";
import { editGallery, GalleryEditDto, getGalleryForEdit } from "@pp/api/dist/panel/private-gallery";
import type { FormInstance } from 'rsuite';
import { galleryModel } from "./gallery-model";
import { PrivateGalleryState } from "@pp/api/dist/private-gallery";
import { ResultType } from "@pp/api/dist/common";
import { translations } from "../../i18n";
import {
    Drawer,
    Button,
    Form,
    ButtonToolbar,
    SelectPicker,
    useToaster,
    Message
} from 'rsuite';

interface Props {
    id: number;
    showEditForm: boolean;
    closeEditForm: () => void;
    onSaved: () => void;
}

export const emptyGallery = (): GalleryEditDto => ({
    date: '',
    title: '',
    notes: '',
    state: PrivateGalleryState.NotReady,
    password: '',
    directPath: '',
    blog: undefined,
});

const states = [
    {
        label: PrivateGalleryState[PrivateGalleryState.Available],
        value: PrivateGalleryState.Available,
    },
    {
        label: PrivateGalleryState[PrivateGalleryState.NotReady],
        value: PrivateGalleryState.NotReady,
    },
    {
        label: PrivateGalleryState[PrivateGalleryState.TurnedOff],
        value: PrivateGalleryState.TurnedOff,
    },
];

let initialGalery: GalleryEditDto = emptyGallery();

export const GalleryEdit = ({ id, showEditForm, closeEditForm, onSaved }: Props) => {
    const [formState, setFormState] = React.useState<GalleryEditDto>(initialGalery);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [blogs, setBlogs] = React.useState<BlogSelectItem[]>([]);
    const formRef = React.useRef<FormInstance>();
    const [formError, setFormError] = React.useState({});
    const [formValue, setFormValue] = React.useState<GalleryEditDto>();
    const toaster = useToaster();

    React.useEffect(() => {
        getBlogSelectList().then(setBlogs);
    }, []);

    React.useEffect(() => {
        getGalleryForEdit(id).then((r) => {
            initialGalery = r;
            setFormState(r);
        });
    }, [id]);

    const submitEditGallery = async () => {
        if (!formRef.current) return;

        formRef.current.check()

        const result = await formRef.current.checkAsync();

        const passwordNotDirty = formValue?.password === initialGalery.password;
        const onlyErrorIsPassword =
            Object.keys(formError).length === 1 && Object.keys(formError).includes('password');
        const ignoreErrors = passwordNotDirty && onlyErrorIsPassword;

        if (ignoreErrors === false && result.hasError) return;

        formRef.current.cleanErrors();

        setIsLoading(true);
        editGallery(id, formState).then((result) => {
            setIsLoading(false);
            if (result.type === ResultType.Success) {
                toaster.push(
                    <Message type="success">{translations.gallery.edit.edited}</Message>
                );
                closeEditForm();
                onSaved();
            } else {
                toaster.push(
                    <Message type="error">{translations.gallery.edit.notEdited}</Message>
                );
            }
        });

    };

    return (
        <Drawer open={showEditForm} onClose={closeEditForm}>
            <Drawer.Header>
                <Drawer.Title>{translations.gallery.edit.title}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
                <Form
                    ref={formRef}
                    model={galleryModel}
                    formValue={formState}
                    formError={formError}
                    onCheck={setFormError}
                    onChange={(x) => setFormState(x as GalleryEditDto)}>
                    <Form.Group>
                        <Form.ControlLabel>{translations.gallery.edit.details.date.label}</Form.ControlLabel>
                        <Form.Control name="date" type="date" />
                        <Form.HelpText tooltip>{translations.gallery.edit.details.date.hint}</Form.HelpText>
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>{translations.gallery.edit.details.title.label}</Form.ControlLabel>
                        <Form.Control name="title" />
                        <Form.HelpText tooltip>{translations.gallery.edit.details.title.hint}</Form.HelpText>
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>{translations.gallery.edit.details.notes.label}</Form.ControlLabel>
                        <Form.Control name="notes" />
                        <Form.HelpText tooltip>{translations.gallery.edit.details.notes.hint}</Form.HelpText>
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>{translations.gallery.edit.details.state.label}</Form.ControlLabel>
                        <Form.Control
                            name="state"
                            style={{ width: 300 }}
                            accepter={SelectPicker}
                            searchable={false}
                            data={states}
                        />
                        <Form.HelpText tooltip>{translations.gallery.edit.details.state.hint}</Form.HelpText>
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>{translations.gallery.edit.details.password.label}</Form.ControlLabel>
                        <Form.Control name="password" checkAsync />
                        <Form.HelpText tooltip>{translations.gallery.edit.details.password.hint}</Form.HelpText>
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>{translations.gallery.edit.details.directPath.label}</Form.ControlLabel>
                        <Form.Control name="directPath" />
                        <Form.HelpText tooltip>{translations.gallery.edit.details.directPath.hint}</Form.HelpText>
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>{translations.gallery.edit.details.blog.label}</Form.ControlLabel>
                        <Form.Control
                            name="blog"
                            style={{ width: 300 }}
                            accepter={SelectPicker}
                            placement="topEnd"
                            searchable={true}
                            data={blogs}
                        />
                        <Form.HelpText tooltip>{translations.gallery.edit.details.blog.hint}</Form.HelpText>
                    </Form.Group>
                    <Form.Group>
                        <ButtonToolbar>
                            <Button onClick={submitEditGallery} appearance="primary" loading={isLoading}>
                                {translations.gallery.edit.save}
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsLoading(false);
                                    closeEditForm();
                                }}
                                appearance="default">
                                {translations.gallery.edit.cancel}
                            </Button>
                        </ButtonToolbar>
                    </Form.Group>
                </Form>
            </Drawer.Body>
        </Drawer>
    );
};
