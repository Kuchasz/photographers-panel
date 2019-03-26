import * as React from 'react';
import { GalleriesList } from "./galleries-list";
import { Panel, Loader } from "rsuite";
import { GalleryStats } from './gallery-stats';
import { GalleryChart } from './gallery-chart';
import { GalleryVisitRange } from './gallery-visit-range';
import { addMonths } from '../../utils/date';
import "./styles.less";
import { Gallery, DailyVisits } from '../../state/gallery';


interface Props {

}

interface State {
    isLoading: boolean;
    visits: DailyVisits[];
    galleries: Gallery[];
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