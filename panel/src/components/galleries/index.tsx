import * as React from "react";
import { GalleriesList } from "./galleries-list";
import { Panel, Loader } from "rsuite";
import { GalleryStats } from "./gallery-stats";
import { GalleryChart } from "./gallery-chart";
import { GalleryVisitRange } from "./gallery-visit-range";
import { addMonths } from "../../../../utils/date";
import "./styles.less";
import { Gallery, getGalleryVisits, VisitsSummary, getGalleriesList, GetGalleryVisitsResult } from "../../../../api/panel/private-gallery";


const getStats = (x: GetGalleryVisitsResult) => ({
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
    visits: VisitsSummary[];
    galleries: Gallery[];
    selectedGallery?: number;
    stats?: {
        todayVisits: number;
        totalVisits: number;
        bestDay: string;
        bestDayVisits: number;
        rangeDays: number;
        rangeVisits: number;
        emails: number;
    },
    startDate: Date;
    endDate: Date;
    disableAutoDate: boolean;
}

export class Galleries extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            visits: [],
            isLoading: false,
            galleries: [],
            stats: undefined,
            selectedGallery: undefined,
            startDate: addMonths(new Date(), -1),
            endDate: new Date(),
            disableAutoDate: false
        };
    }

    componentDidMount() {
        getGalleriesList().then(galleries => {
            const selectedGallery = galleries[0].id;
            this.setState({
                galleries
            });

            this.onGallerySelected(selectedGallery);
        });
    }

    onDateRangeChanged = ([startDate, endDate]: [(Date | undefined)?, (Date | undefined)?]) => {
        if (startDate === undefined || endDate === undefined) return;
        this.setState(() => ({ disableAutoDate: true, startDate, endDate }));
        if (this.state.selectedGallery) {
            this.setState(_state => ({
                isLoading: true
            }));

            getGalleryVisits(startDate, endDate, this.state.selectedGallery).then(resp =>
                this.setState({ isLoading: false, stats: getStats(resp), visits: resp.dailyVisits })
            );
        }
    };

    toggleRandom = () => {
        this.setState(({ disableAutoDate: autoDate }) => ({ disableAutoDate: !autoDate }));
    };

    onGallerySelected = (selectedGallery: number) => {
        if (selectedGallery === this.state.selectedGallery) return;

        const gallery = this.state.galleries.filter(x => x.id === selectedGallery)[0];

        const startDate = this.state.disableAutoDate ? this.state.startDate : new Date(gallery.date);
        const endDate = this.state.disableAutoDate ? this.state.endDate : addMonths(new Date(gallery.date), 1);

        this.setState(_state => ({
            isLoading: true,
            startDate,
            endDate,
            selectedGallery
        }));

        getGalleryVisits(startDate, endDate, selectedGallery).then(resp =>
            this.setState({ isLoading: false, stats: getStats(resp), visits: resp.dailyVisits })
        );
    };

    render() {
        return (
            <div className="galleries">
                <div className="visits">
                    <Panel header={"Visits"}>
                        <GalleryVisitRange
                            onAutoChanged={this.toggleRandom}
                            autoDisabled={this.state.disableAutoDate}
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            onRangeChange={this.onDateRangeChanged}
                        />
                        <GalleryChart visits={this.state.visits}></GalleryChart>
                        {this.state.stats ? <GalleryStats {...this.state.stats} /> : null}
                    </Panel>
                    {this.state.isLoading ? <Loader backdrop content="loading..." vertical /> : null}
                </div>
                <div className="list">
                    <Panel header={"Galleries"}>
                        <GalleriesList galleries={this.state.galleries} onSelect={this.onGallerySelected} />
                    </Panel>
                </div>
            </div>
        );
    }
}
