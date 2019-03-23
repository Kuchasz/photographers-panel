import * as React from 'react';
import { GalleriesList } from "./galleries-list";
import { VisitsSummary, Gallery, GalleriesVistsRootObject } from './state';
import { Panel, Loader } from "rsuite";
import { GalleryStats } from './gallery-stats';
import { GalleryChart } from './gallery-chart';
import { GalleryVisitRange } from './gallery-visit-range';
import { addMonths } from '../../utils/date';
import "./styles.less";


interface Props {

}

interface State {
    isLoading: boolean;
    visits: VisitsSummary[];
    galleries: Gallery[];
    selectedGallery?: number;
    stats?: {today: number, total: number, bestDay: string, days: number, daysTotal: number, emails: number};
    startDate: Date;
    endDate: Date;
    disableAutoDate: boolean;
}

//http://api.pyszstudio.pl/Galleries/Visits?startDate=2017-09-09&endDate=2017-10-09&galleryId=189

const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};


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
        fetch('http://api.pyszstudio.pl/Galleries/Index')
            .then(resp => resp.json())
            .then((galleries: Gallery[]) => {
                const selectedGallery = galleries[0].id;
                this.setState({ 
                    galleries,
                    selectedGallery
                });

                this.onGallerySelected(selectedGallery);
            });
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

        fetch(`http://api.pyszstudio.pl/Galleries/Visits?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}&galleryId=${selectedGallery}`)
            .then(resp => resp.json())
            .then((resp: GalleriesVistsRootObject) => this.setState({ isLoading: false, stats: randomStats(), visits: resp.dailyVisits }));
    };

    onDateRangeChanged = (range: Date[]) => {
        this.setState(() => ({startDate: range[0], endDate: range[1]}));
        this.state.selectedGallery && this.onGallerySelected(this.state.selectedGallery);
    }

    toggleRandom = () => {
        this.setState(({disableAutoDate: autoDate}) => ({disableAutoDate: !autoDate}));
    }

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