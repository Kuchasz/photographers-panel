import { utc as moment } from "moment";
import React from "react";
import { Line } from "react-chartjs-2";
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

const getData = (visits: VisitsSummary[]) => ({
    labels: visits.map(visit => formatDateToDayAndMonth(visit.date)),
    datasets: [
        { fill: '#34c3ff', borderColor: '#34c3ff', data: visits.map(visit => Number(visit.visits)) }
    ]
});

export const GalleryChart = ({ visits }: { visits: VisitsSummary[] }) => <div className="chart"><Line options={chartOptions} data={getData(visits)} /></div>;