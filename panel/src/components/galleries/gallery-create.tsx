import * as React from 'react';
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
    Alert,
} from 'rsuite';
import { PrivateGalleryState } from '@pp/api/private-gallery';
import { BlogSelectItem, getBlogSelectList } from '@pp/api/panel/blog';
import { GalleryEditDto, createGallery } from '@pp/api/panel/private-gallery';
import { ResultType } from '@pp/api/common';
import { galleryModel } from './gallery-model';
import { FormInstance } from 'rsuite/lib/Form/index.d.ts';
import { translations } from '../../i18n';

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
    const formRef = React.useRef<FormInstance>();

    React.useEffect(() => {
        getBlogSelectList().then(setBlogs);
    }, []);

    const submitCreateGallery = async () => {
        if (formRef.current) {
            const result = await formRef.current.checkAsync();
            if (result.hasError) return;
            setIsLoading(true);
            createGallery(formState).then((result) => {
                if (result.type === ResultType.Success) {
                    Alert.success(translations.gallery.create.created);
                    setFormState(emptyGallery());
                    closeCreateForm();
                    onAdded();
                } else {
                    Alert.error(translations.gallery.create.notCreated);
                }
                setIsLoading(false);
            });
        }
    };

    return (
        <Drawer size="xs" placement="right" show={showCreateForm} onHide={closeCreateForm}>
            <Drawer.Header>
                <Drawer.Title>{translations.gallery.create.title}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
                <Form
                    ref={formRef}
                    model={galleryModel()}
                    formValue={formState}
                    onChange={(x) => setFormState(x as GalleryEditDto)}>
                    <FormGroup>
                        <ControlLabel>{translations.gallery.create.details.date.label}</ControlLabel>
                        <FormControl name="date" type="date" />
                        <HelpBlock tooltip>{translations.gallery.create.details.date.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{translations.gallery.create.details.title.label}</ControlLabel>
                        <FormControl name="title" />
                        <HelpBlock tooltip>{translations.gallery.create.details.title.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{translations.gallery.create.details.notes.label}</ControlLabel>
                        <FormControl name="notes" />
                        <HelpBlock tooltip>{translations.gallery.create.details.notes.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{translations.gallery.create.details.state.label}</ControlLabel>
                        <FormControl
                            name="state"
                            style={{ width: 300 }}
                            accepter={SelectPicker}
                            searchable={false}
                            data={states}
                        />
                        <HelpBlock tooltip>{translations.gallery.create.details.state.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{translations.gallery.create.details.password.label}</ControlLabel>
                        <FormControl name="password" checkAsync />
                        <HelpBlock tooltip>{translations.gallery.create.details.password.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{translations.gallery.create.details.directPath.label}</ControlLabel>
                        <FormControl name="directPath" />
                        <HelpBlock tooltip>{translations.gallery.create.details.directPath.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{translations.gallery.create.details.blog.label}</ControlLabel>
                        <FormControl
                            name="blog"
                            style={{ width: 300 }}
                            accepter={SelectPicker}
                            placement="topEnd"
                            searchable={true}
                            data={blogs}
                        />
                        <HelpBlock tooltip>{translations.gallery.create.details.blog.hint}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
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
                    </FormGroup>
                </Form>
            </Drawer.Body>
        </Drawer>
    );
};
