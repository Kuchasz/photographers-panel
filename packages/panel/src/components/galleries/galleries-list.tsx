import {
    Book,
    Envelope,
    Eye,
    EyeSlash,
    PencilSimple,
    ThumbsUp,
    Trash
} from '@phosphor-icons/react';
import { GalleryDto } from '@pp/api/dist/panel/private-gallery';
import { PrivateGalleryState } from '@pp/api/dist/private-gallery';
import { range } from '@pp/utils/dist/array';
import { trim } from '@pp/utils/dist/string';
import React, { useState } from 'react';
import { ButtonToolbar, Divider, IconButton, Progress, Table } from 'rsuite';
import { translations } from '../../i18n';
import { ToolTip } from '../common/tooltip';

interface Props {
    onSelect: (item: any) => void;
    onEdit: (item: any) => void;
    onDelete: (item: any) => void;
    onViewEmails: (item: any) => void;
    onViewLikes: (item: any) => void;
    galleries: GalleryDto[];
    loadingGalleries: boolean;
    selectedGalleryId?: number;
}
interface State { }

const getColorFromGalleryState = (galleryState: PrivateGalleryState): string => {
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

const getIconFromGalleryState = (galleryState: PrivateGalleryState) => {
    switch (galleryState) {
        case PrivateGalleryState.Available:
            return <Eye size={24} />;
        case PrivateGalleryState.TurnedOff:
        case PrivateGalleryState.NotReady:
            return <EyeSlash size={24} />;
        default:
            throw new Error('Not handled GalleryState!');
    }
};

const getColorFromBlogEntry = (blogId: number | undefined) => (blogId ? '#4caf50' : '#f44336');

const stateTooltips = {
    [PrivateGalleryState.Available]: (
        <>
            {translations.gallery.states.state} <i>{translations.gallery.states.available}</i>.
        </>
    ),
    [PrivateGalleryState.TurnedOff]: (
        <>
            {translations.gallery.states.state} <i>{translations.gallery.states.turnedOff}</i>.
        </>
    ),
    [PrivateGalleryState.NotReady]: (
        <>
            {translations.gallery.states.state} <i>{translations.gallery.states.notReady}</i>.
        </>
    ),
};

const blogTooltips = {
    Available: translations.gallery.list.blogAvailable,
    None: translations.gallery.list.blogNotAvailable,
};

const passHash = (password: string) =>
    range(password.length - 1)
        .map((x) => '*')
        .reduce((agg, cur) => agg + cur, '');

const obfuscatePassword = (password: string) => trim(1, password) + passHash(password);

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
    };

    return (
        <span className={'password ' + (passwordRevealed ? 'revealed' : 'not-revealed')}>
            <span className="text">
                {passwordRevealed ? password : obfuscatePassword(password)}
                {passwordRevealed ? <Progress.Circle percent={revealTime} /> : null}
            </span>
            {passwordRevealed ? null : (
                <span onClick={revealPass} className="cover">
                    <Eye size={16} />
                </span>
            )}
        </span>
    );
};

export class GalleriesList extends React.PureComponent<Props, State> {
    render() {
        return (
            <Table
                rowHeight={50}
                virtualized={true}
                shouldUpdateScroll={true}
                onDataUpdated={() => { }}
                loading={this.props.loadingGalleries}
                height={400}
                onRowClick={(item: any) => this.props.onSelect(item)}
                rowClassName={(row: GalleryDto) =>
                    this.props.selectedGalleryId && row?.id === this.props.selectedGalleryId ? 'selected' : ''
                }
                data={this.props.galleries}>
                <Table.Column width={50} align="center">
                    <Table.HeaderCell>{''}</Table.HeaderCell>
                    <Table.Cell dataKey="state">
                        {(gallery: GalleryDto) => (
                            <ToolTip text={stateTooltips[gallery.state]}>
                                <span style={{ color: getColorFromGalleryState(gallery.state) }}>
                                    {getIconFromGalleryState(gallery.state)}
                                </span>
                            </ToolTip>
                        )}
                    </Table.Cell>
                </Table.Column>

                <Table.Column width={50} align="center">
                    <Table.HeaderCell>{''}</Table.HeaderCell>
                    <Table.Cell dataKey="blog">
                        {(gallery: GalleryDto) => (
                            <ToolTip text={gallery.blogId ? blogTooltips.Available : blogTooltips.None}>
                                <Book
                                    size={16}
                                    color={getColorFromBlogEntry(gallery.blogId)}
                                />
                            </ToolTip>
                        )}
                    </Table.Cell>
                </Table.Column>

                <Table.Column flexGrow={1}>
                    <Table.HeaderCell>{translations.gallery.list.headers.title}</Table.HeaderCell>
                    <Table.Cell dataKey="title" />
                </Table.Column>

                <Table.Column flexGrow={1}>
                    <Table.HeaderCell>{translations.gallery.list.headers.notes}</Table.HeaderCell>
                    <Table.Cell dataKey="notes" />
                </Table.Column>

                <Table.Column width={100} align="center">
                    <Table.HeaderCell>{translations.gallery.list.headers.date}</Table.HeaderCell>
                    <Table.Cell dataKey="date" />
                </Table.Column>

                <Table.Column width={120} align="center">
                    <Table.HeaderCell>{translations.gallery.list.headers.password}</Table.HeaderCell>
                    <Table.Cell dataKey="password">
                        {(gallery: GalleryDto) => <Password password={gallery.password} />}
                    </Table.Cell>
                </Table.Column>

                <Table.Column width={140} align="center">
                    <Table.HeaderCell>{translations.gallery.list.headers.totalVisits}</Table.HeaderCell>
                    <Table.Cell dataKey="visits" />
                </Table.Column>

                <Table.Column width={200} align="center" fixed="right">
                    <Table.HeaderCell>{''}</Table.HeaderCell>
                    <Table.Cell className="link-group">
                        {(gallery: GalleryDto) => (
                            <ButtonToolbar>
                                <ToolTip
                                    placement="left"
                                    text={
                                        gallery.pendingNotification
                                            ? translations.gallery.list.actions.notificationsNotSend
                                            : translations.gallery.list.actions.viewEmails
                                    }>
                                    <IconButton
                                        appearance="subtle"
                                        style={gallery.pendingNotification ? { color: '#FFC107' } : {}}
                                        icon={<Envelope size={16} />}
                                        onClick={() => this.props.onViewEmails(gallery.id)}
                                    />
                                </ToolTip>
                                <Divider vertical />
                                <ToolTip placement="left" text={translations.gallery.list.actions.viewLikes}>
                                    <IconButton
                                        appearance="subtle"
                                        icon={<ThumbsUp size={16} />}
                                        onClick={() => this.props.onViewLikes(gallery.id)}
                                    />
                                </ToolTip>
                                <Divider vertical />
                                <ToolTip placement="left" text={translations.gallery.list.actions.edit}>
                                    <IconButton
                                        appearance="subtle"
                                        icon={<PencilSimple size={16} />}
                                        onClick={() => this.props.onEdit(gallery.id)}
                                    />
                                </ToolTip>
                                <Divider vertical />
                                <ToolTip placement="left" text={translations.gallery.list.actions.delete}>
                                    <IconButton
                                        appearance="subtle"
                                        icon={<Trash size={16} />}
                                        onClick={() => this.props.onDelete(gallery.id)}
                                    />
                                </ToolTip>
                            </ButtonToolbar>
                        )}
                    </Table.Cell>
                </Table.Column>
            </Table>
        );
    }
}
