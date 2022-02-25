import React from "react";
import { addMonths } from "@pp/utils/dist/date";
import { GalleryDto, getGalleriesList, getGalleryVisits } from "@pp/api/dist/panel/private-gallery";
import { VisitsSummaryDto } from "@pp/api/dist/panel/visits";

interface Props {}
interface State {
    selectedGallery: number;
    galleries: GalleryDto[];
    disableAutoDate: boolean;
    isLoading: boolean;
    startDate: Date;
    endDate: Date;
    stats: any;
    visits: VisitsSummaryDto[];
}

export class GalleriesState extends React.Component<Props, State> {
    componentDidMount() {
        getGalleriesList().then((galleries) => {
            const selectedGallery = galleries[0].id;

            this.setState({
                galleries,
            });

            this.onGallerySelected(selectedGallery);
        });
    }

    onGallerySelected = (selectedGallery: number) => {
        if (selectedGallery === this.state.selectedGallery) return;

        const gallery = this.state.galleries.filter((x) => x.id === selectedGallery)[0];

        const startDate = this.state.disableAutoDate ? this.state.startDate : new Date(gallery.date);
        const endDate = this.state.disableAutoDate ? this.state.endDate : addMonths(new Date(gallery.date), 1);

        this.setState(() => ({
            isLoading: true,
            startDate,
            endDate,
            selectedGallery,
        }));

        const randomStats = () => ({
            today: Math.floor(Math.random() * 300),
            total: Math.floor(Math.random() * 800),
            bestDay: '10/02/2010',
            days: 20 + Math.floor(Math.random() * 11),
            daysTotal: Math.floor(Math.random() * 100),
            emails: Math.floor(Math.random() * 20),
        });

        getGalleryVisits(startDate, endDate, selectedGallery).then((resp) =>
            this.setState({
                isLoading: false,
                stats: randomStats(),
                visits: resp.dailyVisits,
            })
        );
    };
}
