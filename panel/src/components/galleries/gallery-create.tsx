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
import { PrivateGalleryState } from "../../../../api/private-gallery";
import { BlogSelectItem, getBlogSelectList } from "../../../../api/panel/blog";
import { GalleryEditDto, createGallery } from "../../../../api/panel/private-gallery";
import { FormInstance } from "rsuite/lib/Form/Form";
import { ResultType } from "../../../../api/common";
import { galleryModel } from "./gallery-model";

interface Props {
    showCreateForm: boolean;
    closeCreateForm: () => void;
    onAdded: () => void;
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
                    Alert.success("Gallery successfully added.");
                    setFormState(emptyGallery());
                    closeCreateForm();
                    onAdded();
                } else {
                    Alert.error("An error occured while adding gallery.");
                }
                setIsLoading(false);
            });
        }
    };

    return (
        <Drawer size="xs" placement="right" show={showCreateForm} onHide={closeCreateForm}>
            <Drawer.Header>
                <Drawer.Title>Create new gallery</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
                <Form
                    ref={formRef}
                    model={galleryModel()}
                    formValue={formState}
                    onChange={(x) => setFormState(x as GalleryEditDto)}
                >
                    <FormGroup>
                        <ControlLabel>Place</ControlLabel>
                        <FormControl name="place" />
                        <HelpBlock tooltip>Place of the wedding</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Date</ControlLabel>
                        <FormControl name="date" type="date" />
                        <HelpBlock tooltip>Date of the wedding</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Bride</ControlLabel>
                        <FormControl name="bride" />
                        <HelpBlock tooltip>Bride name</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Groom</ControlLabel>
                        <FormControl name="groom" />
                        <HelpBlock tooltip>Groom name</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Last Name</ControlLabel>
                        <FormControl name="lastName" />
                        <HelpBlock tooltip>Last name</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>State</ControlLabel>
                        <FormControl
                            name="state"
                            style={{ width: 300 }}
                            accepter={SelectPicker}
                            searchable={false}
                            data={states}
                        />
                        <HelpBlock tooltip>State of the gallery</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Password</ControlLabel>
                        <FormControl name="password" type="password" checkAsync />
                        <HelpBlock tooltip>
                            Password must be min 8 characters with numbers, upper and lowercases
                        </HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Direct path</ControlLabel>
                        <FormControl name="directPath" />
                        <HelpBlock tooltip>Direct path to the gallery</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Blog</ControlLabel>
                        <FormControl
                            name="blog"
                            style={{ width: 300 }}
                            accepter={SelectPicker}
                            placement="topEnd"
                            searchable={true}
                            data={blogs}
                        />
                        <HelpBlock tooltip>Blog for the wedding</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ButtonToolbar>
                            <Button onClick={submitCreateGallery} appearance="primary" loading={isLoading}>
                                Save
                            </Button>
                            <Button
                                onClick={() => {
                                    setFormState(emptyGallery());
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
