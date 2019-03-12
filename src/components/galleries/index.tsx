import * as React from 'react';
import { GalleriesList } from "./galleries-list";
import { VisitsSummary, Gallery, GalleriesVistsRootObject } from './state';
import { Panel, Loader } from "rsuite";
import { GalleryStats } from './gallery-stats';
import { GalleryChart } from './gallery-chart';
import "./styles.less";


interface Props {

}

interface State {
    isLoading: boolean;
    visits: VisitsSummary[];
    galleries: Gallery[];
    selectedGallery?: number;
    stats?: {today: number, total: number, bestDay: string, days: number, daysTotal: number}
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
            selectedGallery: undefined
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

        this.setState(_state => ({
            isLoading: true
        }));

        const randomStats = () =>({
            today: Math.floor(Math.random()*300),
            total: Math.floor(Math.random()*800),
            bestDay: '10/02/2010',
            days: 20 + Math.floor(Math.random()*11),
            daysTotal: Math.floor(Math.random()*100)
        });

        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);

        setTimeout(() => fetch(`http://api.pyszstudio.pl/Galleries/Visits?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}&galleryId=${selectedGallery}`)
            .then(resp => resp.json())
            .then((resp: GalleriesVistsRootObject) => this.setState({ isLoading: false, stats: randomStats(), visits: resp.dailyVisits })), 1000);
    };

    render() {
        return <>
            <div className="visits">
                    <Panel header={'Visits'}>
                        <GalleryChart visits={this.state.visits}></GalleryChart>
                        {this.state.stats ? <GalleryStats {...this.state.stats} /> : null }
                    </Panel>
                { this.state.isLoading ? <Loader backdrop content="loading..." vertical />: null }
            </div>
                <Panel header={'Galleries'}>
                    <GalleriesList galleries={this.state.galleries} onSelect={this.onGallerySelected} />
                </Panel>
        </>
    }
}