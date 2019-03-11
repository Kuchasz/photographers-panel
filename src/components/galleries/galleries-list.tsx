import * as React from 'react';
import { Gallery, GalleryStates } from './state';
import { Tooltip, Table, Icon, Whisper } from "rsuite";

interface Props {
    onSelect: (item: any) => void;
    galleries: Gallery[];
}
interface State{

}

const getColorFromGalleryState = (galleryState: GalleryStates): any => {
    switch (galleryState) {
        case GalleryStates.Available:
            return '#4CAF50';
        case GalleryStates.TurnedOff:
            return '#F44336';
        case GalleryStates.NotReady:
            return '#FFC107';
        default:
            throw new Error('Not handled GalleryState!');
    }
};

const tooltips = {
    [GalleryStates.Available]: <Tooltip>Gallery is <i>available</i>.</Tooltip>,
    [GalleryStates.TurnedOff]: <Tooltip>Gallery is <i>turned off</i>.</Tooltip>,
    [GalleryStates.NotReady]: <Tooltip>Gallery is <i>not ready yet</i>.</Tooltip>,
};

// const iconStyle = {boxShadow: 'none'};

// const onGalleryClicked = (galleryId: number, trigger: (id: number) => void) => trigger(galleryId);

// const GalleryListItem = React.memo(({isSelected, id, onSelect, state, place}: {isSelected:boolean, id:number, onSelect:(id:number)=>void, state:GalleryStates, place:string}) => <Table.Row
//     active={isSelected}
//     key={id}
//     onClick={() => onGalleryClicked(id, onSelect)}>
//     <Table.Cell>
//         <Icon
//         bordered
//         style={iconStyle}
//         icon='info circle'
//         size='lg'
//         color={getColorFromGalleryState(state)}></Icon>
//                     </Table.Cell>
//     <Table.Cell>{place}</Table.Cell>
//     <Table.Cell><Soon/></Table.Cell>
//     <Table.Cell><Soon/></Table.Cell>
//     <Table.Cell><Soon/></Table.Cell>
//     </Table.Row>)

// export const GalleriesList = ({onSelect, galleries}: Props) => <Table style={{willChange: 'transform'}}selectable>
//             <Table.Header>
//                 <Table.Row>
//                     <Table.HeaderCell>State</Table.HeaderCell>
//                     <Table.HeaderCell>Wedding</Table.HeaderCell>
//                     <Table.HeaderCell>Recent Visit</Table.HeaderCell>
//                     <Table.HeaderCell>Total Visits</Table.HeaderCell>
//                     <Table.HeaderCell>#</Table.HeaderCell>
//                 </Table.Row>
//             </Table.Header>
//             <Table.Body>
//                 {galleries.map(({id, isSelected, state, place}) => <GalleryListItem key={id} id={id} onSelect={onSelect} isSelected={isSelected} state={state} place={place}></GalleryListItem>)}
//             </Table.Body>
//         </Table>;

//style={{color:{getColorFromGalleryState(state)}}}

export class GalleriesList extends React.PureComponent<Props, State>{
    
    render() { return <Table height={400} onRowClick={this.props.onSelect} data={this.props.galleries}>
            <Table.Column align="center" fixed>
            <Table.HeaderCell>State</Table.HeaderCell>
            <Table.Cell dataKey="state">{(gallery: Gallery) =>
                    <Whisper trigger="hover" speaker={tooltips[gallery.state]}><Icon icon="info" style={{color: getColorFromGalleryState(gallery.state)}}/></Whisper>
                }
            </Table.Cell>
            </Table.Column>

            <Table.Column flexGrow={3} fixed>
            <Table.HeaderCell>Wedding</Table.HeaderCell>
            <Table.Cell dataKey="place" />
            </Table.Column>

            <Table.Column flexGrow={2} fixed>
            <Table.HeaderCell>Recent Visit</Table.HeaderCell>
            <Table.Cell dataKey="state" />
            </Table.Column>

            <Table.Column flexGrow={2} fixed>
            <Table.HeaderCell>Total Visits</Table.HeaderCell>
            <Table.Cell dataKey="state" />
            </Table.Column>

            <Table.Column fixed>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.Cell dataKey="state" />
            </Table.Column>
    </Table>}};

