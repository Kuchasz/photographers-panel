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
import { FormInstance } from "rsuite/lib/Form/index.d.ts";
import { translations } from "../../i18n";

interface Props {
    id: number;
    showEditForm: boolean;
    closeEditForm: () => void;
    onSaved: () => void;
}

export const emptyGallery = (): GalleryEditDto => ({
    place: "",
    date: "",
    bride: "",
    groom: "",
    lastName: "",
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

export const GalleryEdit = ({ id, showEditForm, closeEditForm, onSaved }: Props) => {
    const [formState, setFormState] = React.useState<GalleryEditDto>(emptyGallery());
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [blogs, setBlogs] = React.useState<BlogSelectItem[]>([]);
    const formRef = React.useRef<FormInstance>();

    React.useEffect(() => {
        getBlogSelectList().then(setBlogs);
    }, []);

    React.useEffect(() => {
        getGalleryForEdit(id).then(setFormState);
    }, [id]);

    const submitEditGallery = async () => {
        if (formRef.current) {
            const result = await formRef.current.checkAsync();
            if (result.hasError) return;
            setIsLoading(true);
            editGallery(id, formState).then((result) => {
                if (result.type === ResultType.Success) {
                    Alert.success(translations.gallery.edit.edited);
                    closeEditForm();
                    onSaved();
                } else {
                    Alert.error(translations.gallery.edit.notEdited);
                }
                setIsLoading(false);
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
                        <ControlLabel>{translations.gallery.edit.details.place.label}</ControlLabel>
                        <FormControl name="place" />
                        <HelpBlock tooltip>{translations.gallery.edit.details.place.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{translations.gallery.edit.details.date.label}</ControlLabel>
                        <FormControl name="date" type="date" />
                        <HelpBlock tooltip>{translations.gallery.edit.details.date.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{translations.gallery.edit.details.bride.label}</ControlLabel>
                        <FormControl name="bride" />
                        <HelpBlock tooltip>{translations.gallery.edit.details.bride.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{translations.gallery.edit.details.groom.label}</ControlLabel>
                        <FormControl name="groom" />
                        <HelpBlock tooltip>{translations.gallery.edit.details.groom.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{translations.gallery.edit.details.lastName.label}</ControlLabel>
                        <FormControl name="lastName" />
                        <HelpBlock tooltip>{translations.gallery.edit.details.lastName.hint}</HelpBlock>
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
