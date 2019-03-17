import * as React from 'react';
import { Gallery, GalleryStates } from './state';
import { Tooltip, Table, Icon, Whisper } from "rsuite";

interface Props {
    onSelect: (item: any) => void;
    galleries: Gallery[];
}
interface State {

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

export class GalleriesList extends React.PureComponent<Props, State>{

    render() {
        return <Table height={400} onRowClick={(item: any) => this.props.onSelect(item.id)} data={this.props.galleries}>
            <Table.Column align="center" fixed>
                <Table.HeaderCell>State</Table.HeaderCell>
                <Table.Cell dataKey="state">{(gallery: Gallery) =>
                    <Whisper trigger="hover" speaker={tooltips[gallery.state]}><Icon icon="info" style={{ color: getColorFromGalleryState(gallery.state) }} /></Whisper>
                }
                </Table.Cell>
            </Table.Column>

            <Table.Column flexGrow={3} fixed>
                <Table.HeaderCell>Wedding</Table.HeaderCell>
                <Table.Cell dataKey="place" />
            </Table.Column>

            <Table.Column>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.Cell dataKey="date" />
            </Table.Column>

            <Table.Column>
                <Table.HeaderCell>Pass</Table.HeaderCell>
                <Table.Cell dataKey="pass" />
            </Table.Column>

            <Table.Column flexGrow={3}>
                <Table.HeaderCell>Direct path</Table.HeaderCell>
                <Table.Cell dataKey="dir" />
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
        </Table>
    }
};

