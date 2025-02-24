import * as React from "react";
import { BlogSelectItem, getBlogSelectList } from "@pp/api/dist/panel/blog";
import { createGallery, GalleryEditDto } from "@pp/api/dist/panel/private-gallery";
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
    Message,
    useToaster
} from 'rsuite';

interface Props {
    showCreateForm: boolean;
    closeCreateForm: () => void;
    onAdded: () => void;
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

export const GalleryCreate = ({ showCreateForm, closeCreateForm, onAdded }: Props) => {
    const [formState, setFormState] = React.useState<GalleryEditDto>(emptyGallery());
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [blogs, setBlogs] = React.useState<BlogSelectItem[]>([]);
    const [formError, setFormError] = React.useState({});
    const formRef = React.useRef<FormInstance>();
    const toaster = useToaster();

    React.useEffect(() => {
        getBlogSelectList().then(setBlogs);
    }, []);

    const submitCreateGallery = async () => {
        if (!formRef.current) return;

        formRef.current.check();
        
        const result = await formRef.current.checkAsync();
        if (result.hasError) return;

        setIsLoading(true);
        createGallery(formState).then((result) => {
            if (result.type === ResultType.Success) {
                toaster.push(
                    <Message type="success">{translations.gallery.create.created}</Message>
                );
                setFormState(emptyGallery());
                closeCreateForm();
                onAdded();
            } else {
                toaster.push(
                    <Message type="error">{translations.gallery.create.notCreated}</Message>
                );
            }
            setIsLoading(false);
        });
    };

    return (
        <Drawer size="xs" placement="right" open={showCreateForm} onClose={closeCreateForm}>
            <Drawer.Header>
                <Drawer.Title>{translations.gallery.create.title}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
                <Form
                    ref={formRef as React.Ref<FormInstance>}
                    model={galleryModel}
                    formValue={formState}
                    formError={formError}
                    onCheck={setFormError}
                    onChange={(x) => setFormState(x as GalleryEditDto)}>
                    <Form.Group>
                        <Form.ControlLabel>{translations.gallery.create.details.date.label}</Form.ControlLabel>
                        <Form.Control name="date" type="date" />
                        <Form.HelpText tooltip>{translations.gallery.create.details.date.hint}</Form.HelpText>
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>{translations.gallery.create.details.title.label}</Form.ControlLabel>
                        <Form.Control name="title" />
                        <Form.HelpText tooltip>{translations.gallery.create.details.title.hint}</Form.HelpText>
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>{translations.gallery.create.details.notes.label}</Form.ControlLabel>
                        <Form.Control name="notes" />
                        <Form.HelpText tooltip>{translations.gallery.create.details.notes.hint}</Form.HelpText>
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>{translations.gallery.create.details.state.label}</Form.ControlLabel>
                        <Form.Control
                            name="state"
                            style={{ width: 300 }}
                            accepter={SelectPicker}
                            searchable={false}
                            data={states}
                        />
                        <Form.HelpText tooltip>{translations.gallery.create.details.state.hint}</Form.HelpText>
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>{translations.gallery.create.details.password.label}</Form.ControlLabel>
                        <Form.Control name="password" checkAsync />
                        <Form.HelpText tooltip>{translations.gallery.create.details.password.hint}</Form.HelpText>
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>{translations.gallery.create.details.directPath.label}</Form.ControlLabel>
                        <Form.Control name="directPath" />
                        <Form.HelpText tooltip>{translations.gallery.create.details.directPath.hint}</Form.HelpText>
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>{translations.gallery.create.details.blog.label}</Form.ControlLabel>
                        <Form.Control
                            name="blog"
                            style={{ width: 300 }}
                            accepter={SelectPicker}
                            placement="topEnd"
                            searchable={true}
                            data={blogs}
                        />
                        <Form.HelpText tooltip>{translations.gallery.create.details.blog.hint}</Form.HelpText>
                    </Form.Group>
                    <Form.Group>
                        <ButtonToolbar>
                            <Button onClick={submitCreateGallery} appearance="primary" loading={isLoading}>
                                {translations.gallery.create.save}
                            </Button>
                            <Button
                                onClick={() => {
                                    setFormState(emptyGallery());
                                    setIsLoading(false);
                                    closeCreateForm();
                                }}
                                appearance="default">
                                {translations.gallery.create.cancel}
                            </Button>
                        </ButtonToolbar>
                    </Form.Group>
                </Form>
            </Drawer.Body>
        </Drawer>
    );
};
