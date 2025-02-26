import * as React from "react";
import { useState, useEffect } from "react";
import {
    Button,
    Message,
    Panel,
    useToaster
} from "rsuite";
import { Plus } from '@phosphor-icons/react';
import { ChartStat } from "../stats-chart/stats";
import { confirm } from "../common/confirmation";
import { GalleriesList } from "./galleries-list";
import { GalleryCreate } from "./gallery-create";
import { GalleryEdit } from "./gallery-edit";
import { GalleryEmails } from "./gallery-emails";
import { ResultType } from "@pp/api/dist/common";
import { StatsChart } from "../stats-chart";
import { translations } from "../../i18n";
import { VisitsSummaryDto } from "@pp/api/dist/panel/visits";
import "./styles.less";
// import { addMonths } from "@pp/utils/dist/date";
import {
    GalleryDto,
    getGalleryVisits,
    getGalleriesList,
    GalleryVisitsDto,
    deleteGallery,
} from '@pp/api/dist/panel/private-gallery';
import { GalleryLikes } from "./gallery-likes";

const getStats = (x: GalleryVisitsDto): ChartStat[] => [
    { label: translations.gallery.stats.todayVisits, value: x.todayVisits },
    { label: translations.gallery.stats.totalVisits, value: x.totalVisits },
    { label: translations.gallery.stats.rangeVisits, value: x.rangeVisits },
    { label: translations.gallery.stats.bestDay, value: x.bestDay.date || '---' },
    { label: translations.gallery.stats.bestDayVisits, value: x.bestDay.visits },
    { label: translations.gallery.stats.emails, value: x.emails },
];

interface Props {}

export const Galleries: React.FC<Props> = () => {
    const toaster = useToaster();
    
    const [isLoadingGalleries, setIsLoadingGalleries] = useState(false);
    const [visits, setVisits] = useState<VisitsSummaryDto[]>([]);
    const [galleries, setGalleries] = useState<GalleryDto[]>([]);
    const [selectedGallery, setSelectedGallery] = useState<GalleryDto | undefined>(undefined);
    const [stats, setStats] = useState<ChartStat[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showGalleryViewEmails, setShowGalleryViewEmails] = useState(false);
    const [showGalleryViewLikes, setShowGalleryViewLikes] = useState(false);
    const [galleryToEditId, setGalleryToEditId] = useState<number | undefined>(undefined);

    useEffect(() => {
        fetchGalleries();
    }, []);

    const fetchGalleries = () => {
        setIsLoadingGalleries(true);
        
        getGalleriesList().then((galleries) => {
            const firstGallery = galleries[0];
            setGalleries(galleries);
            setIsLoadingGalleries(false);

            if (firstGallery) {
                onGallerySelected(firstGallery);
            }
        });
    };

    const onGallerySelected = (gallery: GalleryDto) => {
        if (gallery === selectedGallery) return;

        // const startDate = disableAutoDate ? startDate : new Date(gallery.date);
        // const endDate = disableAutoDate ? endDate : addMonths(new Date(gallery.date), 1);

        setSelectedGallery(gallery);

        // getGalleryVisits(gallery).then((resp) => {
        //     setStats(getStats(resp));
        //     setVisits(resp.dailyVisits);
        // });
    };

    const onGalleryEdit = (selectedGalleryId: number) => {
        setGalleryToEditId(selectedGalleryId);
        setShowEditForm(true);
    };

    const onGalleryDelete = async (selectedGalleryId: number) => {
        const confirmed = await confirm(
            translations.gallery.delete.confirmationContent,
            translations.gallery.delete.confirmationHeader
        );
        
        if (confirmed) {
            const result = await deleteGallery(selectedGalleryId);
            if (result.type === ResultType.Success) {
                toaster.push(
                    <Message type="success">{translations.gallery.delete.deleted}</Message>
                );
                fetchGalleries();
            } else {
                toaster.push(
                    <Message type="error">{translations.gallery.delete.notDeleted}</Message>
                );
            }
        }
    };

    const onGalleryViewEmails = (selectedGalleryId: number) => {
        setGalleryToEditId(selectedGalleryId);
        setShowGalleryViewEmails(true);
    };

    const onGalleryViewLikes = (selectedGalleryId: number) => {
        setGalleryToEditId(selectedGalleryId);
        setShowGalleryViewLikes(true);
    };

    const closeGalleryViewEmails = () => {
        setShowGalleryViewEmails(false);
        setGalleryToEditId(undefined);
    };

    const closeGalleryViewLikes = () => {
        setShowGalleryViewLikes(false);
        setGalleryToEditId(undefined);
    };

    const closeCreateForm = () => {
        setShowCreateForm(false);
    };

    const handleShowCreateForm = () => {
        setShowCreateForm(true);
    };

    const closeEditForm = () => {
        setShowEditForm(false);
        setGalleryToEditId(undefined);
    };

    const gallerySave = () => {
        setShowEditForm(false);
        setGalleryToEditId(undefined);
        fetchGalleries();
    };

    const onNotified = () => {
        setShowGalleryViewEmails(false);
        setGalleryToEditId(undefined);
        fetchGalleries();
    };

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
                    selectedItem={selectedGallery!}
                />
            </Panel>
            <div className="list">
                <Panel
                    header={
                        <Button onClick={handleShowCreateForm} color="green">
                            <Plus size={16} /> {translations.gallery.create.button}
                        </Button>
                    }>
                    <GalleriesList
                        galleries={galleries}
                        loadingGalleries={isLoadingGalleries}
                        onSelect={onGallerySelected}
                        onEdit={onGalleryEdit}
                        onDelete={onGalleryDelete}
                        onViewEmails={onGalleryViewEmails}
                        onViewLikes={onGalleryViewLikes}
                        selectedGalleryId={selectedGallery?.id}
                    />
                </Panel>
            </div>
            <GalleryCreate
                onAdded={fetchGalleries}
                showCreateForm={showCreateForm}
                closeCreateForm={closeCreateForm}
            />
            {galleryToEditId && (
                <GalleryEdit
                    onSaved={gallerySave}
                    showEditForm={showEditForm}
                    closeEditForm={closeEditForm}
                    id={galleryToEditId}
                />
            )}
            {galleryToEditId && (
                <GalleryEmails
                    show={showGalleryViewEmails}
                    close={closeGalleryViewEmails}
                    onNotified={onNotified}
                    id={galleryToEditId}
                />
            )}
            {galleryToEditId && (
                <GalleryLikes
                    show={showGalleryViewLikes}
                    close={closeGalleryViewLikes}
                    onNotified={onNotified}
                    id={galleryToEditId}
                />
            )}
        </div>
    );
};
