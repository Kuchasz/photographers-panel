import * as React from 'react';
import { SemanticCOLORS, Icon, Table } from 'semantic-ui-react';
import { Soon } from "../soon";
import { Gallery, GalleryStates } from './state';



interface Props {
    onSelect: (id: number) => void;
    galleries: Gallery[];
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

// const getPopupFromGalleryState = (galleryState: GalleryStates): string => {
//     switch (galleryState) {
//         case GalleryStates.Available:
//             return 'Gallery is available';
//         case GalleryStates.TurnedOff:
//             return 'Gallery is turned off';
//         case GalleryStates.NotReady:
//             return 'Gallery is not ready yet';
//         default:
//             throw new Error('Not handled GalleryState!');
//     }
// };

const iconStyle = {boxShadow: 'none'};

const onGalleryClicked = (galleryId: number, trigger: (id: number) => void) => trigger(galleryId);

const GalleryListItem = React.memo(({isSelected, id, onSelect, state, place}: {isSelected:boolean, id:number, onSelect:(id:number)=>void, state:GalleryStates, place:string}) => <Table.Row
    active={isSelected}
    key={id}
    onClick={() => onGalleryClicked(id, onSelect)}>
    <Table.Cell>
        <Icon
        bordered
        style={iconStyle}
        name='info circle'
        size='large'
        color={getColorFromGalleryState(state)}></Icon>
                    </Table.Cell>
    <Table.Cell>{place}</Table.Cell>
    <Table.Cell><Soon/></Table.Cell>
    <Table.Cell><Soon/></Table.Cell>
    <Table.Cell><Soon/></Table.Cell>
    </Table.Row>)

export const GalleriesList = ({onSelect, galleries}: Props) => <Table style={{willChange: 'transform'}}selectable>
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
                {galleries.map(({id, isSelected, state, place}) => <GalleryListItem key={id} id={id} onSelect={onSelect} isSelected={isSelected} state={state} place={place}></GalleryListItem>)}
            </Table.Body>
        </Table>;