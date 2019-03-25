import React, { useState } from 'react';
import { Tooltip, Table, Icon, Whisper, Progress } from "rsuite";
import { range } from '../../utils/array';
import { GalleryStates, Gallery } from '../../api/gallery';

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

const getColorFromBlogEntry = (blogEntryId: string)=> blogEntryId ? '#4caf50' : '#f44336';

const stateTooltips = {
    [GalleryStates.Available]: <Tooltip>Gallery is <i>available</i>.</Tooltip>,
    [GalleryStates.TurnedOff]: <Tooltip>Gallery is <i>turned off</i>.</Tooltip>,
    [GalleryStates.NotReady]: <Tooltip>Gallery is <i>not ready yet</i>.</Tooltip>,
};


const passHash = (password: string) => range(password.length - 1).map(x => "*").reduce((agg, cur) => agg + cur, "");

const obfuscatePassword = (password: string) => password.slice(0, 1) + passHash(password);

const Password = ({ password }: { password: string }) => {
    const [passwordRevealed, revealPassword] = useState(false);
    const [revealTime, setRevealTime] = useState(0);

    const revealPass = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        let rTime = 0;
        setRevealTime(rTime);
        e.stopPropagation();
        revealPassword(true);

        const interval = setInterval(() => {
            if (rTime === 100) {
                revealPassword(false);
                clearInterval(interval);
                setRevealTime(0);
            }
            rTime += 5;
            setRevealTime(rTime);
        }, 250);
    }

    return <span className={"password " + (passwordRevealed ? 'revealed' : 'not-revealed')}>
        <span className="text">
            {passwordRevealed ? password : obfuscatePassword(password)}
            {passwordRevealed ? <Progress.Circle percent={revealTime} /> : null}
        </span>
        {passwordRevealed ? null : <span onClick={revealPass} className="cover"><Icon icon="eye" /></span>}

    </span>
}

export class GalleriesList extends React.PureComponent<Props, State>{

    render() {
        return <Table height={400} onRowClick={(item: any) => this.props.onSelect(item.id)} data={this.props.galleries}>
            <Table.Column width={50} align="center" fixed>
                <Table.HeaderCell>State</Table.HeaderCell>
                <Table.Cell dataKey="state">{(gallery: Gallery) =>
                    <Whisper trigger="hover" speaker={stateTooltips[gallery.state]}><Icon icon="info" style={{ color: getColorFromGalleryState(gallery.state) }} /></Whisper>
                }
                </Table.Cell>
            </Table.Column>

            <Table.Column width={50} align="center" fixed>
                <Table.HeaderCell>Blog</Table.HeaderCell>
                <Table.Cell dataKey="blogEntryId">{(gallery: Gallery) =>
                    <Icon icon="book" style={{ color: getColorFromBlogEntry(gallery.BlogEntryId) }} />
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

            <Table.Column width={80}>
                <Table.HeaderCell>Pass</Table.HeaderCell>
                <Table.Cell dataKey="pass">{(gallery: Gallery) => <Password password={gallery.pass} />}</Table.Cell>
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

