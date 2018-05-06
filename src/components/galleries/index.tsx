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
}

const fakedata = {
    labels: [
        'uno', 'duo', 'tri', 'quattro', 'picko'
    ],
    datasets: [
        {data: [14,233,31,44,512]}
    ]
};

export class Galleries extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {selectedGallery: undefined};
    }

    render() {
        return <div style={{display: 'flex'}}>
            <GalleriesList onSelect={gallery => this.setState({selectedGallery: gallery})}/>
            <Line options={{responsive: true}} data={fakedata}/>
        </div>
    }
}