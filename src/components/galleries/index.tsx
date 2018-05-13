import * as React from 'react';
import {GalleriesList} from "./galleriesList.component";
import {Line} from 'react-chartjs-2';

export interface VisitsSummary {
    date: string;
    visits: string;
}

export interface RootObject {
    bestDay: VisitsSummary;
    dailyVisits: VisitsSummary[];
    sumOfVisits: number;
    rangeSumOfVisits?: number;
}

interface Props {

}

interface State {
    selectedGallery?: number;
    visits: VisitsSummary[];
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
            selectedGallery: undefined,
            visits: []};
    }

    onGallerySelected(selectedGallery: number) {
        this.setState({selectedGallery});

        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);

        fetch(`http://api.pyszstudio.pl/Galleries/Visits?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}&galleryId=${selectedGallery}`)
            .then(resp => resp.json())
            .then((resp: RootObject) => this.setState({visits: resp.dailyVisits}));
    };

    render() {
        const data = {
            labels: this.state.visits.map(visit => visit.date.toString()),
            datasets: [
                {borderColor: '#32CD32', data: this.state.visits.map(visit => Number(visit.visits))}
                ]
        };
        return <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Line height={100} width={300} options={{responsive: true}} data={data}/>
            <div>
                <GalleriesList onSelect={gallery => this.onGallerySelected(gallery)}/>
            </div>
        </div>
    }
}