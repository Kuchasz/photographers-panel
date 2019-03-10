import { utc as moment } from "moment";
import React from "react";
import { Line } from "react-chartjs-2";
import { FlexboxGrid, Panel } from "rsuite";
import { ChartOptions } from "chart.js";
import { VisitsSummary } from "./state";
import "./galleryVisits.less";

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

export const GalleryVisits = ({visits}: {visits: VisitsSummary[]}) => <>
    <FlexboxGrid style={{ height: '100%', position: 'relative' }}>
        <FlexboxGrid.Item style={{height: '100%'}} colspan={18}>
            <Panel className="visits-chart" header={<h3>Visits</h3>}>
                <Line options={chartOptions} data={getData(visits)}/>
            </Panel>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={6}>
            <Panel header={<h3>Stats</h3>}></Panel>
        </FlexboxGrid.Item>
    </FlexboxGrid>
</>