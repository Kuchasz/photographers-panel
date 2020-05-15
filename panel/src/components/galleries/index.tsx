import * as React from "react";
import { GalleriesList } from "./galleries-list";
import { GalleryCreate } from "./gallery-create";
import { Panel, Icon, Button, Alert } from "rsuite";
import { GalleryStats } from "./gallery-stats";
import { GalleryChart } from "./gallery-chart";
import { GalleryVisitRange } from "./gallery-visit-range";
import { addMonths } from "../../../../utils/date";
import "./styles.less";
import {
    GalleryDto,
    getGalleryVisits,
    VisitsSummaryDto,
    getGalleriesList,
    GalleryVisitsDto,
    deleteGallery
} from "../../../../api/panel/private-gallery";
import { GalleryEdit } from "./gallery-edit";
import { confirm } from "../common/confirmation";
import { ResultType } from "../../../../api/common";

const getStats = (x: GalleryVisitsDto) => ({
    todayVisits: x.todayVisits,
    totalVisits: x.totalVisits,
    bestDay: x.bestDay.date,
    bestDayVisits: x.bestDay.visits,
    rangeDays: x.rangeDays,
    rangeVisits: x.rangeVisits,
    emails: x.emails
});

interface Props {}

interface State {
    isLoading: boolean;
    isLoadingGalleries: boolean;
    visits: VisitsSummaryDto[];
    galleries: GalleryDto[];
    selectedGallery?: number;
    stats?: {
        todayVisits: number;
        totalVisits: number;
        bestDay: string;
        bestDayVisits: number;
        rangeDays: number;
        rangeVisits: number;
        emails: number;
    };
    startDate: Date;
    endDate: Date;
    disableAutoDate: boolean;
    showCreateForm: boolean;
    showEditForm: boolean;
    galleryToEditId?: number;
}

export class Galleries extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            visits: [],
            isLoading: false,
            isLoadingGalleries: false,
            galleries: [],
            stats: undefined,
            selectedGallery: undefined,
            startDate: addMonths(new Date(), -1),
            endDate: new Date(),
            disableAutoDate: false,
            showCreateForm: false,
            showEditForm: false,
            galleryToEditId: undefined
        };
    }

    componentDidMount() {
        this.fetchGalleries();
    }

    fetchGalleries = () => {
        this.setState(
            () => ({ isLoadingGalleries: true }),
            () => {
                getGalleriesList().then((galleries) => {
                    const selectedGallery = galleries[0].id;
                    this.setState({
                        galleries,
                        isLoadingGalleries: false
                    });

                    this.onGallerySelected(selectedGallery);
                });
            }
        );
    };

    onDateRangeChanged = ([startDate, endDate]: [(Date | undefined)?, (Date | undefined)?]) => {
        if (startDate === undefined || endDate === undefined) return;
        this.setState(() => ({ disableAutoDate: true, startDate, endDate }));
        if (this.state.selectedGallery) {
            this.setState((_state) => ({
                isLoading: true
            }));

            getGalleryVisits(startDate, endDate, this.state.selectedGallery).then((resp) =>
                this.setState({ isLoading: false, stats: getStats(resp), visits: resp.dailyVisits })
            );
        }
    };

    toggleRandom = () => {
        this.setState(({ disableAutoDate: autoDate }) => ({ disableAutoDate: !autoDate }));
    };

    onGallerySelected = (selectedGallery: number) => {
        if (selectedGallery === this.state.selectedGallery) return;

        const gallery = this.state.galleries.filter((x) => x.id === selectedGallery)[0];

        const startDate = this.state.disableAutoDate ? this.state.startDate : new Date(gallery.date);
        const endDate = this.state.disableAutoDate ? this.state.endDate : addMonths(new Date(gallery.date), 1);

        this.setState((_state) => ({
            isLoading: true,
            startDate,
            endDate,
            selectedGallery
        }));

        getGalleryVisits(startDate, endDate, selectedGallery).then((resp) =>
            this.setState({ isLoading: false, stats: getStats(resp), visits: resp.dailyVisits })
        );
    };

    onGalleryEdit = (selectedGallery: number) => {
        this.setState({
            galleryToEditId: selectedGallery,
            showEditForm: true
        });
    };

    onGalleryDelete = async (selectedGallery: number) => {
        const confirmed = await confirm("You are sure you want to remove the gallery?", "Removing of gallery");
        if (confirmed) {
            const result = await deleteGallery(selectedGallery);
            if (result.type === ResultType.Success) {
                Alert.success("Gallery deleted.");
                this.fetchGalleries();
            } else {
                Alert.error("Gallery not deleted.");
            }
        }
    };

    closeCreateForm = () => {
        this.setState({ showCreateForm: false });
    };

    showCreateForm = () => {
        this.setState({ showCreateForm: true });
    };

    closeEditForm = () => {
        this.setState({ showEditForm: false });
    };

    showEditForm = () => {
        this.setState({ showEditForm: true });
    };

    render() {
        return (
            <div className="galleries">
                <div className="visits">
                    <Panel>
                        <header>
                            <GalleryVisitRange
                                onAutoChanged={this.toggleRandom}
                                autoDisabled={this.state.disableAutoDate}
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                                onRangeChange={this.onDateRangeChanged}
                            />
                            <span>
                                {this.state.stats != null ? (
                                    <GalleryStats isLoading={this.state.isLoading} {...this.state.stats} />
                                ) : null}
                            </span>
                        </header>
                        <GalleryChart visits={this.state.visits}></GalleryChart>
                    </Panel>
                </div>
                <div className="list">
                    <Panel
                        header={
                            <Button onClick={this.showCreateForm} color="green">
                                <Icon icon="plus" /> Create Gallery
                            </Button>
                        }
                    >
                        <GalleriesList
                            galleries={this.state.galleries}
                            loadingGalleries={this.state.isLoadingGalleries}
                            onSelect={this.onGallerySelected}
                            onEdit={this.onGalleryEdit}
                            onDelete={this.onGalleryDelete}
                        />
                    </Panel>
                </div>
                <GalleryCreate
                    onAdded={this.fetchGalleries}
                    showCreateForm={this.state.showCreateForm}
                    closeCreateForm={this.closeCreateForm}
                />
                {this.state.galleryToEditId ? (
                    <GalleryEdit
                        onSaved={this.fetchGalleries}
                        showEditForm={this.state.showEditForm}
                        closeEditForm={this.closeEditForm}
                        id={this.state.galleryToEditId}
                    />
                ) : null}
            </div>
        );
    }
}
