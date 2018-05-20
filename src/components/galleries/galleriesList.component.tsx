import * as React from 'react';
import {SemanticCOLORS, Popup, Icon, Table} from 'semantic-ui-react';
import {Soon} from "../soon";

enum GalleryStates {
    NotReady = "0",
    Available = "1",
    TurnedOff = "2"
}

interface Gallery {
    id: number;
    date: string;
    place: string;
    bride: string;
    groom: string;
    lastname: string;
    state: GalleryStates;
    pass: string;
    dir: string;
    BlogEntryId: string;
}

interface Props {
    onSelect: (id: number) => void;
}

interface State {
    galleries: Gallery[];
    selectedGallery?: number;
}

const getColorFromGalleryState = (galleryState: GalleryStates): SemanticCOLORS => {
    switch (galleryState) {
        case GalleryStates.Available:
            return 'green';
        case GalleryStates.TurnedOff:
            return 'red';
        case GalleryStates.NotReady:
            return 'grey';
        default:
            throw new Error('Not handled GalleryState!');
    }
};

const getPopupFromGalleryState = (galleryState: GalleryStates): string => {
    switch (galleryState) {
        case GalleryStates.Available:
            return 'Gallery is available';
        case GalleryStates.TurnedOff:
            return 'Gallery is turned off';
        case GalleryStates.NotReady:
            return 'Gallery is not ready yet';
        default:
            throw new Error('Not handled GalleryState!');
    }
};

export class GalleriesList extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            galleries: [],
            selectedGallery: undefined
        }
    }

    componentDidMount() {
        fetch('http://api.pyszstudio.pl/Galleries/Index')
            .then(resp => resp.json())
            .then((galleries: Gallery[]) => this.setState({galleries}));
    }

    onGalleryClicked(gallery: number) {
        const {onSelect} = this.props;
        onSelect(gallery);
        this.setState({selectedGallery: gallery});
    }

    render() {
        const {galleries, selectedGallery} = this.state;
        return <Table selectable>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>State</Table.HeaderCell>
                    <Table.HeaderCell>Wedding</Table.HeaderCell>
                    <Table.HeaderCell>Recent Visit</Table.HeaderCell>
                    <Table.HeaderCell>Total Visits</Table.HeaderCell>
                    <Table.HeaderCell>#</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {galleries.map((gallery: Gallery) => <Table.Row
                    active={gallery.id === selectedGallery}
                    key={gallery.id}
                    onClick={() => this.onGalleryClicked(gallery.id)}>
                    <Table.Cell><Popup trigger={<Icon
                        bordered
                        style={{boxShadow: 'none'}}
                        name='info circle'
                        size='large'
                        color={getColorFromGalleryState(gallery.state)}></Icon>}
                                       content={getPopupFromGalleryState(gallery.state)}></Popup></Table.Cell>
                    <Table.Cell>{gallery.place}</Table.Cell>
                    <Table.Cell><Soon/></Table.Cell>
                    <Table.Cell><Soon/></Table.Cell>
                    <Table.Cell><Soon/></Table.Cell>
                </Table.Row>)}
            </Table.Body>
        </Table>;

        // <List selection divided verticalAlign='middle'>
        //     {galleries.map((gallery: Gallery) => <List.Item

        //         >

        //         <List.Content>
        //             <List.Header>{gallery.date}</List.Header>
        //             <List.Description>{gallery.place}</List.Description>
        //         </List.Content>
        //     </List.Item>)}
        // </List>;
    }
}