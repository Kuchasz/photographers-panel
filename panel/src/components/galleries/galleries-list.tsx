import React, { useState } from 'react';
import { Tooltip, Table, Icon, Whisper, Progress } from "rsuite";
import { range } from '../../../../utils/array';
import { Gallery } from '../../../../api/panel/private-gallery';
import { PrivateGalleryState } from '../../../../api/private-gallery';

interface Props {
    onSelect: (item: any) => void;
    galleries: Gallery[];
}
interface State {
}

const getColorFromGalleryState = (galleryState: PrivateGalleryState): any => {
    switch (galleryState) {
        case PrivateGalleryState.Available:
            return '#4CAF50';
        case PrivateGalleryState.TurnedOff:
            return '#F44336';
        case PrivateGalleryState.NotReady:
            return '#FFC107';
        default:
            throw new Error('Not handled GalleryState!');
    }
};

const getColorFromBlogEntry = (blogId: string)=> blogId ? '#4caf50' : '#f44336';

const stateTooltips = {
    [PrivateGalleryState.Available]: <Tooltip>Gallery is <i>available</i>.</Tooltip>,
    [PrivateGalleryState.TurnedOff]: <Tooltip>Gallery is <i>turned off</i>.</Tooltip>,
    [PrivateGalleryState.NotReady]: <Tooltip>Gallery is <i>not ready yet</i>.</Tooltip>,
};

const blogTooltips = {
    Available: <Tooltip>Blog is <i>available</i>.</Tooltip>,
    None: <Tooltip>There is <i>no blog</i>.</Tooltip>
}


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
        return <Table rowHeight={50} virtualized={true} height={400} onRowClick={(item: any) => this.props.onSelect(item.id)} data={this.props.galleries}>
            <Table.Column width={50} align="center">
                <Table.HeaderCell>State</Table.HeaderCell>
                <Table.Cell dataKey="state">{(gallery: Gallery) =>
                    <Whisper trigger="hover" speaker={stateTooltips[gallery.state]}><Icon icon="info" style={{ color: getColorFromGalleryState(gallery.state) }} /></Whisper>
                }
                </Table.Cell>
            </Table.Column>

            <Table.Column width={50} align="center">
                <Table.HeaderCell>Blog</Table.HeaderCell>
                <Table.Cell dataKey="blog">{(gallery: Gallery) =>
                    <Whisper trigger="hover" speaker={gallery.blogId ? blogTooltips.Available : blogTooltips.None}><Icon icon="book" style={{ color: getColorFromBlogEntry(gallery.blogId) }} /></Whisper>
                }
                </Table.Cell>
            </Table.Column>

            <Table.Column flexGrow={1}>
                <Table.HeaderCell>Wedding</Table.HeaderCell>
                <Table.Cell dataKey="place" />
            </Table.Column>

            <Table.Column width={100} align="center">
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.Cell dataKey="date" />
            </Table.Column>

            <Table.Column width={100} align="center">
                <Table.HeaderCell>Pass</Table.HeaderCell>
                <Table.Cell dataKey="password">{(gallery: Gallery) => <Password password={gallery.password} />}</Table.Cell>
            </Table.Column>

            <Table.Column flexGrow={2} width={350}>
                <Table.HeaderCell>Direct path</Table.HeaderCell>
                <Table.Cell dataKey="url" />
            </Table.Column>

            <Table.Column width={100} align="center">
                <Table.HeaderCell>Total Visits</Table.HeaderCell>
                <Table.Cell dataKey="visits" />
            </Table.Column>
            <Table.Column width={120} fixed="right">
            <Table.HeaderCell>Action</Table.HeaderCell>

            <Table.Cell>
              {(gallery: Gallery) => {
                function handleAction() {
                  alert(`id:${gallery.id}`);
                }
                return (
                  <span>
                    <a onClick={handleAction}> Edit </a> |{' '}
                    <a onClick={handleAction}> Remove </a>
                  </span>
                );
              }}
            </Table.Cell>
          </Table.Column>
        </Table>
    }
};

