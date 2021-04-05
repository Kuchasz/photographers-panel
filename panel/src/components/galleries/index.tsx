import * as React from 'react';
import { GalleriesList } from './galleries-list';
import { GalleryCreate } from './gallery-create';
import { Panel, Icon, Button, Alert } from 'rsuite';
import { ChartStat } from '../stats-chart/stats';
// import { addMonths } from "@pp/utils/date";
import './styles.less';
import {
    GalleryDto,
    getGalleryVisits,
    getGalleriesList,
    GalleryVisitsDto,
    deleteGallery,
} from '@pp/api/panel/private-gallery';
import { GalleryEdit } from './gallery-edit';
import { confirm } from '../common/confirmation';
import { ResultType } from '@pp/api/common';
import { GalleryEmails } from './gallery-emails';
import { StatsChart } from '../stats-chart';
import { VisitsSummaryDto } from '@pp/api/panel/visits';
import { translations } from '../../i18n';

const getStats = (x: GalleryVisitsDto): ChartStat[] => [
    { label: translations.gallery.stats.todayVisits, value: x.todayVisits },
    { label: translations.gallery.stats.totalVisits, value: x.totalVisits },
    { label: translations.gallery.stats.rangeVisits, value: x.rangeVisits },
    { label: translations.gallery.stats.bestDay, value: x.bestDay.date || '---' },
    { label: translations.gallery.stats.bestDayVisits, value: x.bestDay.visits },
    { label: translations.gallery.stats.emails, value: x.emails },
];

interface Props {}

interface State {
    isLoadingGalleries: boolean;
    visits: VisitsSummaryDto[];
    galleries: GalleryDto[];
    selectedGallery?: GalleryDto;
    stats: ChartStat[];
    showCreateForm: boolean;
    showEditForm: boolean;
    showGalleryViewEmails: boolean;
    galleryToEditId?: number;
}

export class Galleries extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            visits: [],
            isLoadingGalleries: false,
            galleries: [],
            stats: [],
            selectedGallery: undefined,
            showCreateForm: false,
            showEditForm: false,
            showGalleryViewEmails: false,
            galleryToEditId: undefined,
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
                    const selectedGallery = galleries[0]; //.id;
                    this.setState({
                        galleries,
                        isLoadingGalleries: false,
                    });

                    this.onGallerySelected(selectedGallery);
                });
            }
        );
    };

    onGallerySelected = (selectedGallery: GalleryDto) => {
        if (selectedGallery === this.state.selectedGallery) return;

        // const gallery = this.state.galleries.filter((x) => x.id === selectedGallery)[0];
        // const startDate = this.state.disableAutoDate ? this.state.startDate : new Date(gallery.date);
        // const endDate = this.state.disableAutoDate ? this.state.endDate : addMonths(new Date(gallery.date), 1);

        this.setState((_state) => ({
            selectedGallery,
        }));

        // getGalleryVisits(selectedGallery).then((resp) =>
        //     this.setState({ stats: getStats(resp), visits: resp.dailyVisits })
        // );
    };

    onGalleryEdit = (selectedGallery: number) => {
        this.setState({
            galleryToEditId: selectedGallery,
            showEditForm: true,
        });
    };

    onGalleryDelete = async (selectedGallery: number) => {
        const confirmed = await confirm(
            translations.gallery.delete.confirmationContent,
            translations.gallery.delete.confirmationHeader
        );
        if (confirmed) {
            const result = await deleteGallery(selectedGallery);
            if (result.type === ResultType.Success) {
                Alert.success(translations.gallery.delete.deleted);
                this.fetchGalleries();
            } else {
                Alert.error(translations.gallery.delete.notDeleted);
            }
        }
    };

    onGalleryViewEmails = (selectedGallery: number) => {
        this.setState({
            galleryToEditId: selectedGallery,
            showGalleryViewEmails: true,
        });
    };

    closeGalleryViewEmails = () => {
        this.setState({ showGalleryViewEmails: false, galleryToEditId: undefined });
    };

    closeCreateForm = () => {
        this.setState({ showCreateForm: false });
    };

    showCreateForm = () => {
        this.setState({ showCreateForm: true });
    };

    closeEditForm = () => {
        this.setState({ showEditForm: false, galleryToEditId: undefined });
    };

    gallerySave = () => {
        this.setState({ showEditForm: false, galleryToEditId: undefined });
        this.fetchGalleries();
    };

    onNotified = () => {
        this.setState({ showGalleryViewEmails: false, galleryToEditId: undefined });
        this.fetchGalleries();
    };

    showEditForm = () => {
        this.setState({ showEditForm: true });
    };

    render() {
        return (
            <div className="galleries">
                <Panel>
                    <StatsChart
                        fetchChartStatsData={async (s, e, i) => {
                            const result = await getGalleryVisits(s, e, i);
                            const stats = getStats(result);
                            const data = result.dailyVisits.map((dv) => ({
                                date: dv.date,
                                value: dv.visits,
                            }));
                            return { data, stats };
                        }}
                        selectedItem={this.state.selectedGallery!}
                    />
                </Panel>
                <div className="list">
                    <Panel
                        header={
                            <Button onClick={this.showCreateForm} color="green">
                                <Icon icon="plus" /> {translations.gallery.create.button}
                            </Button>
                        }>
                        <GalleriesList
                            galleries={this.state.galleries}
                            loadingGalleries={this.state.isLoadingGalleries}
                            onSelect={this.onGallerySelected}
                            onEdit={this.onGalleryEdit}
                            onDelete={this.onGalleryDelete}
                            onViewEmails={this.onGalleryViewEmails}
                            selectedGalleryId={this.state.selectedGallery?.id}
                        />
                    </Panel>
                </div>
                <GalleryCreate
                    onAdded={() => this.fetchGalleries()}
                    showCreateForm={this.state.showCreateForm}
                    closeCreateForm={this.closeCreateForm}
                />
                {this.state.galleryToEditId ? (
                    <GalleryEdit
                        onSaved={this.gallerySave}
                        showEditForm={this.state.showEditForm}
                        closeEditForm={this.closeEditForm}
                        id={this.state.galleryToEditId}
                    />
                ) : null}
                {this.state.galleryToEditId ? (
                    <GalleryEmails
                        show={this.state.showGalleryViewEmails}
                        close={this.closeGalleryViewEmails}
                        onNotified={this.onNotified}
                        id={this.state.galleryToEditId}
                    />
                ) : null}
            </div>
        );
    }
}
