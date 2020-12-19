import React, { useState } from "react";
import { Table, Icon, Progress, ButtonToolbar, IconButton, Divider } from "rsuite";
import { range } from "@pp/utils/array";
import { GalleryDto } from "@pp/api/panel/private-gallery";
import { PrivateGalleryState } from "@pp/api/private-gallery";
import { ToolTip } from "../common/tooltip";
import { translations } from "../../i18n";

interface Props {
    onSelect: (item: any) => void;
    onEdit: (item: any) => void;
    onDelete: (item: any) => void;
    onViewEmails: (item: any) => void;
    galleries: GalleryDto[];
    loadingGalleries: boolean;
    selectedGalleryId?: number;
}
interface State { }

const getColorFromGalleryState = (galleryState: PrivateGalleryState): any => {
    switch (galleryState) {
        case PrivateGalleryState.Available:
            return "#4CAF50";
        case PrivateGalleryState.TurnedOff:
            return "#F44336";
        case PrivateGalleryState.NotReady:
            return "#FFC107";
        default:
            throw new Error("Not handled GalleryState!");
    }
};

const getIconFromGalleryState = (galleryState: PrivateGalleryState): any => {
    switch (galleryState) {
        case PrivateGalleryState.Available:
            return "btn-on";
        case PrivateGalleryState.TurnedOff:
        case PrivateGalleryState.NotReady:
            return "btn-off";
        default:
            throw new Error("Not handled GalleryState!");
    }
};

const getColorFromBlogEntry = (blogId: number) => (blogId ? "#4caf50" : "#f44336");

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
    )
};

const blogTooltips = {
    Available: (
        <>
            {translations.gallery.states.state} <i>{translations.gallery.states.available}</i>.
        </>
    ),
    None: (
        <>
            {translations.gallery.list.notAvailablePre} <i>{translations.gallery.list.notAvailablePost}</i>.
        </>
    )
};

const passHash = (password: string) =>
    range(password.length - 1)
        .map((x) => "*")
        .reduce((agg, cur) => agg + cur, "");

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
    };

    return (
        <span className={"password " + (passwordRevealed ? "revealed" : "not-revealed")}>
            <span className="text">
                {passwordRevealed ? password : obfuscatePassword(password)}
                {passwordRevealed ? <Progress.Circle percent={revealTime} /> : null}
            </span>
            {passwordRevealed ? null : (
                <span onClick={revealPass} className="cover">
                    <Icon icon="eye" />
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
                rowClassName={(row: GalleryDto) => this.props.selectedGalleryId && row?.id === this.props.selectedGalleryId ? "selected" : ""}
                data={this.props.galleries}
            >
                <Table.Column width={50} align="center">
                    <Table.HeaderCell></Table.HeaderCell>
                    <Table.Cell dataKey="state">
                        {(gallery: GalleryDto) => (
                            <ToolTip text={stateTooltips[gallery.state]}>
                                <Icon icon={getIconFromGalleryState(gallery.state)} style={{ fontSize: "24px", marginTop: "-2px", color: getColorFromGalleryState(gallery.state) }} />
                            </ToolTip>
                        )}
                    </Table.Cell>
                </Table.Column>

                <Table.Column width={50} align="center">
                    <Table.HeaderCell></Table.HeaderCell>
                    <Table.Cell dataKey="blog">
                        {(gallery: GalleryDto) => (
                            <ToolTip text={gallery.blogId ? blogTooltips.Available : blogTooltips.None}>
                                <Icon icon="book" style={{ color: getColorFromBlogEntry(gallery.blogId) }} />
                            </ToolTip>
                        )}
                    </Table.Cell>
                </Table.Column>

                <Table.Column flexGrow={1}>
                    <Table.HeaderCell>{translations.gallery.list.headers.place}</Table.HeaderCell>
                    <Table.Cell dataKey="place" />
                </Table.Column>

                <Table.Column flexGrow={1}>
                    <Table.HeaderCell>{translations.gallery.list.headers.lastName}</Table.HeaderCell>
                    <Table.Cell dataKey="lastName" />
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

                <Table.Column width={100} align="center">
                    <Table.HeaderCell>{translations.gallery.list.headers.totalVisits}</Table.HeaderCell>
                    <Table.Cell dataKey="visits" />
                </Table.Column>

                <Table.Column width={200} align="center" fixed="right">
                    <Table.HeaderCell></Table.HeaderCell>
                    <Table.Cell className="link-group">
                        {(gallery: GalleryDto) => (
                            <ButtonToolbar>
                                <ToolTip placement="left" text={translations.gallery.list.actions.edit}>
                                    <IconButton
                                        appearance="subtle"
                                        icon={<Icon icon="edit2" />}
                                        onClick={() => this.props.onEdit(gallery.id)}
                                    />
                                </ToolTip>
                                <Divider vertical />
                                <ToolTip placement="left" text={translations.gallery.list.actions.delete}>
                                    <IconButton
                                        appearance="subtle"
                                        icon={<Icon icon="trash2" />}
                                        onClick={() => this.props.onDelete(gallery.id)}
                                    />
                                </ToolTip>
                                <Divider vertical />
                                <ToolTip placement="left" text={gallery.pendingNotification ? translations.gallery.list.actions.notificationsNotSend : translations.gallery.list.actions.viewEmails}>
                                    <IconButton
                                        appearance="subtle"
                                        style={gallery.pendingNotification ? { color: "#FFC107" } : {}}
                                        icon={<Icon icon="envelope-o" />}
                                        onClick={() => this.props.onViewEmails(gallery.id)}
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
