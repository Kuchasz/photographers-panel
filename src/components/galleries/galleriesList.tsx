import * as React from 'react';
import { SemanticCOLORS, Popup, Icon, Table } from 'semantic-ui-react';
import { Soon } from "../soon";
import { Gallery, GalleryStates } from './state';



interface Props {
    onSelect: (id: number) => void;
    galleries: Gallery[];
}

interface State {
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

const iconStyle = {boxShadow: 'none'};

export class GalleriesList extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            selectedGallery: undefined
        }
    }

    onGalleryClicked(gallery: number) {
        const {onSelect} = this.props;
        onSelect(gallery);
        this.setState({selectedGallery: gallery});
    }

    render() {
        console.log('renders');
        const {selectedGallery} = this.state;
        const {galleries} = this.props;
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
                        style={iconStyle}
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
    }
}