import { utc as moment } from "moment";
import React from "react";
import { Line } from "react-chartjs-2";
import { Loader } from "rsuite";
import { ChartOptions } from "chart.js";
import { VisitsSummary } from "./state";

const chartOptions: ChartOptions = {
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

console.warn('Set color of graph basing of state of gallery');

const getData = (visits: VisitsSummary[]) => ({
    labels: visits.map(visit => formatDateToDayAndMonth(visit.date)),
    datasets: [
        {fill: '#34c3ff', borderColor: '#34c3ff', data: visits.map(visit => Number(visit.visits))}
    ]
});

export const GalleryVisits = ({isLoading, visits}: {isLoading: boolean, visits: VisitsSummary[]}) => <>
    <div style={{height: '300px', position: 'relative'}}>
        { isLoading ? <Loader backdrop content="loading..." vertical />: null }
        <Line options={chartOptions} data={getData(visits)}/>
    </div>
</>