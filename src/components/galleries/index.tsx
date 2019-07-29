import * as React from 'react';
import { GalleriesList } from "./galleries-list";
import { Panel, Loader } from "rsuite/lib";
import { GalleryStats } from './gallery-stats';
import { GalleryChart } from './gallery-chart';
import { GalleryVisitRange } from './gallery-visit-range';
import { addMonths } from '../../utils/date';
import "./styles.less";
import { Gallery as GalleryState, DailyVisits } from '../../state/gallery';
import { Gallery, getVisits, GalleriesVistsRootObject, getAll } from '../../api/gallery';


interface Props {

}

interface State {
    isLoading: boolean;
    visits: DailyVisits[];
    galleries: GalleryState[];
    selectedGallery?: number;
    stats?: {today: number, total: number, bestDay: string, days: number, daysTotal: number, emails: number};
    startDate: Date;
    endDate: Date;
    disableAutoDate: boolean;
}

//http://api.pyszstudio.pl/Galleries/Visits?startDate=2017-09-09&endDate=2017-10-09&galleryId=189




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
        getAll()
            .then((galleries: Gallery[]) => {
                const selectedGallery = galleries[0].id;
                this.setState({ 
                    galleries: galleries.map(x => ({
                        brideName: x.bride,
                        groomName: x.groom,
                        password: x.pass,
                        lastName: x.lastname,
                        id: x.id,
                        date: x.date,
                        place: x.place,
                        state: x.state,
                        directoryName: x.dir,
                        blog: x.BlogEntryId
                    }))
                });

                this.onGallerySelected(selectedGallery);
            });
    }

    onDateRangeChanged = (range: Date[]) => {
        this.setState(() => ({startDate: range[0], endDate: range[1]}));
        this.state.selectedGallery && this.onGallerySelected(this.state.selectedGallery);
    }

    toggleRandom = () => {
        this.setState(({disableAutoDate: autoDate}) => ({disableAutoDate: !autoDate}));
    }

    onGallerySelected = (selectedGallery: number) => {

        if(selectedGallery === this.state.selectedGallery)
            return;

        const gallery = this.state.galleries.filter(x => x.id === selectedGallery)[0];

        const startDate = this.state.disableAutoDate ? this.state.startDate : new Date(gallery.date);
        const endDate = this.state.disableAutoDate ? this.state.endDate : addMonths(new Date(gallery.date), 1);

        this.setState(_state => ({
            isLoading: true,
            startDate,
            endDate,
            selectedGallery
        }));

        const randomStats = () =>({
            today: Math.floor(Math.random()*300),
            total: Math.floor(Math.random()*800),
            bestDay: '10/02/2010',
            days: 20 + Math.floor(Math.random()*11),
            daysTotal: Math.floor(Math.random()*100),
            emails: Math.floor(Math.random()*20)
        });

        getVisits(startDate, endDate, selectedGallery)
            .then((resp: GalleriesVistsRootObject) => this.setState({ isLoading: false, stats: randomStats(), visits: resp.dailyVisits }));
    };

    render() {
        return <div className="galleries">
            <div className="visits">
                    <Panel header={'Visits'}>
                        <GalleryVisitRange 
                            onAutoChanged={this.toggleRandom}
                            autoDisabled={this.state.disableAutoDate} 
                            startDate={this.state.startDate} 
                            endDate={this.state.endDate} 
                            onRangeChange={this.onDateRangeChanged}/>
                        <GalleryChart visits={this.state.visits}></GalleryChart>
                        {this.state.stats ? <GalleryStats {...this.state.stats} /> : null }
                    </Panel>
                { this.state.isLoading ? <Loader backdrop content="loading..." vertical />: null }
            </div>
            <div className="list">
                <Panel header={'Galleries'}>
                    <GalleriesList galleries={this.state.galleries} onSelect={this.onGallerySelected} />
                </Panel>
            </div>
        </div>
    }
}