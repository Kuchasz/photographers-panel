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
    SelectPicker,
    Alert
} from "rsuite";
import { PrivateGalleryState } from "@pp/api/private-gallery";
import { BlogSelectItem, getBlogSelectList } from "@pp/api/panel/blog";
import { GalleryEditDto, editGallery, getGalleryForEdit } from "@pp/api/panel/private-gallery";
import { ResultType } from "@pp/api/common";
import { galleryModel } from "./gallery-model";
import { translations } from "../../i18n";
import { FormInstance } from "rsuite/lib/Form";

interface Props {
    id: number;
    showEditForm: boolean;
    closeEditForm: () => void;
    onSaved: () => void;
}

export const emptyGallery = (): GalleryEditDto => ({
    date: "",
    title: "",
    notes: "",
    state: PrivateGalleryState.NotReady,
    password: "",
    directPath: "",
    blog: undefined
});

const states = [
    { label: PrivateGalleryState[PrivateGalleryState.Available], value: PrivateGalleryState.Available },
    { label: PrivateGalleryState[PrivateGalleryState.NotReady], value: PrivateGalleryState.NotReady },
    { label: PrivateGalleryState[PrivateGalleryState.TurnedOff], value: PrivateGalleryState.TurnedOff }
];

let initialGalery: GalleryEditDto = emptyGallery();

export const GalleryEdit = ({ id, showEditForm, closeEditForm, onSaved }: Props) => {
    const [formState, setFormState] = React.useState<GalleryEditDto>(initialGalery);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [blogs, setBlogs] = React.useState<BlogSelectItem[]>([]);
    const formRef = React.useRef<FormInstance>();

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
        if (formRef.current) {
            const result = await formRef.current.checkAsync();

            const { formError } = formRef.current.state as any;
            const { formValue } = formRef.current.props as any;
            const passwordNotDirty = formValue.password === initialGalery.password;
            const onlyErrorIsPassword = Object.keys(formError).length === 1 && Object.keys(formError).includes("password");
            const ignoreErrors = passwordNotDirty && onlyErrorIsPassword;

            if (ignoreErrors === false && result.hasError)
                return;

            formRef.current.cleanErrors();

            setIsLoading(true);
            editGallery(id, formState).then((result) => {
                setIsLoading(false);
                if (result.type === ResultType.Success) {
                    Alert.success(translations.gallery.edit.edited);
                    closeEditForm();
                    onSaved();
                } else {
                    Alert.error(translations.gallery.edit.notEdited);
                }
            });
        }
    };

    return (
        <Drawer size="xs" placement="right" show={showEditForm} onHide={closeEditForm}>
            <Drawer.Header>
                <Drawer.Title>{translations.gallery.edit.title}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
                <Form
                    ref={formRef}
                    model={galleryModel(id)}
                    formValue={formState}
                    onChange={(x) => setFormState(x as GalleryEditDto)}
                >
                    <FormGroup>
                        <ControlLabel>{translations.gallery.edit.details.date.label}</ControlLabel>
                        <FormControl name="date" type="date" />
                        <HelpBlock tooltip>{translations.gallery.edit.details.date.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{translations.gallery.edit.details.title.label}</ControlLabel>
                        <FormControl name="title" />
                        <HelpBlock tooltip>{translations.gallery.edit.details.title.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{translations.gallery.edit.details.notes.label}</ControlLabel>
                        <FormControl name="notes" />
                        <HelpBlock tooltip>{translations.gallery.edit.details.notes.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{translations.gallery.edit.details.state.label}</ControlLabel>
                        <FormControl
                            name="state"
                            style={{ width: 300 }}
                            accepter={SelectPicker}
                            searchable={false}
                            data={states}
                        />
                        <HelpBlock tooltip>{translations.gallery.edit.details.state.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{translations.gallery.edit.details.password.label}</ControlLabel>
                        <FormControl name="password" checkAsync />
                        <HelpBlock tooltip>{translations.gallery.edit.details.password.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{translations.gallery.edit.details.directPath.label}</ControlLabel>
                        <FormControl name="directPath" />
                        <HelpBlock tooltip>{translations.gallery.edit.details.directPath.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{translations.gallery.edit.details.blog.label}</ControlLabel>
                        <FormControl
                            name="blog"
                            style={{ width: 300 }}
                            accepter={SelectPicker}
                            placement="topEnd"
                            searchable={true}
                            data={blogs}
                        />
                        <HelpBlock tooltip>{translations.gallery.edit.details.blog.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ButtonToolbar>
                            <Button onClick={submitEditGallery} appearance="primary" loading={isLoading}>
                                {translations.gallery.edit.save}
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsLoading(false);
                                    closeEditForm();
                                }}
                                appearance="default"
                            >
                                {translations.gallery.edit.cancel}
                            </Button>
                        </ButtonToolbar>
                    </FormGroup>
                </Form>
            </Drawer.Body>
        </Drawer>
    );
};
