import * as React from 'react';
import {GalleriesList} from "./galleriesList.component";
import {Line} from 'react-chartjs-2';
import * as chartjs from "chart.js";
import {Dimmer, Loader, Segment} from "semantic-ui-react";

const moment = require('moment');

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
    isLoading: boolean;
    visits: VisitsSummary[];
}

//http://api.pyszstudio.pl/Galleries/Visits?startDate=2017-09-09&endDate=2017-10-09&galleryId=189

const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};

const chartOptions: chartjs.ChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
        display: false
    },
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true
                }
            }
        ]
    }
};

const formatDateToDayAndMonth = (dateString: string) => moment(dateString, "DD-MM-YYYY").format("DD/MM");

export class Galleries extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            selectedGallery: undefined,
            visits: [],
            isLoading: false
        };
    }

    onGallerySelected(selectedGallery: number) {
        this.setState({selectedGallery, isLoading: true});

        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);

        fetch(`http://api.pyszstudio.pl/Galleries/Visits?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}&galleryId=${selectedGallery}`)
            .then(resp => resp.json())
            .then((resp: RootObject) => this.setState({isLoading: false, visits: resp.dailyVisits}));
    };

    render() {
        const data = {
            labels: this.state.visits.map(visit => formatDateToDayAndMonth(visit.date)),
            datasets: [
                {borderColor: '#32CD32', data: this.state.visits.map(visit => Number(visit.visits))}
            ]
        };
        return <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Segment style={{height: '200px'}}>
                <Dimmer active={this.state.isLoading} inverted>
                    <Loader size='medium'>Loading</Loader>
                </Dimmer>
                <Line options={chartOptions} data={data}/>
            </Segment>
            <div style={{overflowY: 'auto'}}>
                <GalleriesList onSelect={gallery => this.onGallerySelected(gallery)}/>
            </div>
        </div>
    }
}