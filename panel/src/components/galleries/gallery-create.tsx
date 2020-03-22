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
    Schema
} from "rsuite";
import { PrivateGalleryState } from "../../../../api/private-gallery";
import { BlogSelectItem, getBlogSelectList } from "../../../../api/panel/blog";
import { checkPasswordIsUnique, GalleryPayload, createGallery } from "../../../../api/panel/private-gallery";
import { FormInstance } from "rsuite/lib/Form/Form";

interface Props {
    showCreateForm: boolean;
    closeCreateForm: () => void;
}

export const emptyGalleryPayload = (): GalleryPayload => ({
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

var galleryCreateSchema = Schema.Model({
    place: Schema.Types.StringType()
        .isRequired("Place of the wedding must be set.")
        .minLength(5, "Place of the wedding must be at least 5 characters long."),
    date: Schema.Types.DateType().isRequired("Date of the wedding must be set."),
    bride: Schema.Types.StringType()
        .isRequired("Name of the bride must be set.")
        .minLength(3, "Bride of the wedding must be at least 3 characters long."),
    groom: Schema.Types.StringType()
        .isRequired("Name of the groom must be set.")
        .minLength(3, "Groom of the wedding must be at least 3 characters long."),
    lastName: Schema.Types.StringType()
        .isRequired("Last name must be set.")
        .minLength(3, "Last name must be at least 3 characters long."),
    state: Schema.Types.NumberType()
        .isRequired("State must be set.")
        .isOneOf(
            [PrivateGalleryState.Available, PrivateGalleryState.NotReady, PrivateGalleryState.TurnedOff],
            "State can only be only of specified values."
        ),
    password: Schema.Types.StringType()
        .isRequired("Password is required.")
        .containsUppercaseLetter("Password should contain uppercase letter.")
        .containsLowercaseLetter("Password should contain lowercase letter.")
        .containsNumber("Password must contain numbers.")
        .minLength(8, "Password must be at least 8 characters long.")
        .addRule(checkPasswordIsUnique, "Password must be unique."),
    directPath: Schema.Types.StringType().isURL("Direct path must be an url."),
    blog: Schema.Types.NumberType()
});

export const GalleryCreate = ({ showCreateForm, closeCreateForm }: Props) => {
    const [formState, setFormState] = React.useState<GalleryPayload>(emptyGalleryPayload());
    const [blogs, setBlogs] = React.useState<BlogSelectItem[]>([]);
    const formRef = React.useRef<FormInstance>();

    React.useEffect(() => {
        getBlogSelectList().then(setBlogs);
    }, []);

    const submitCreateGallery = () => {
        if (formRef.current) {
            if (formRef.current.check()) {
                createGallery(formState).then(result => {
                    console.log(result);
                });
            }
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
                    model={galleryCreateSchema}
                    formValue={formState}
                    onChange={x => setFormState(x as GalleryPayload)}
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
                            <Button onClick={submitCreateGallery} appearance="primary">
                                Submit
                            </Button>
                            <Button
                                onClick={() => {
                                    setFormState(emptyGalleryPayload());
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
