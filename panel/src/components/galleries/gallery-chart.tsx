import React from "react";
import { VisitsSummaryDto } from "../../../../api/panel/private-gallery";
import { getDayAndMonth } from "../../../../utils/date";

import ChartistGraph from "react-chartist";

const chartOptions = {
    low: 0,
    showArea: true,
    height: 300
};

const formatDateToDayAndMonth = (dateString: string) => getDayAndMonth(new Date(dateString));

const getData = (visits: VisitsSummaryDto[]) => ({
    labels: visits.map((visit) => formatDateToDayAndMonth(visit.date)),
    series: [visits.map((visit) => Number(visit.visits))]
});

export const GalleryChart = ({ visits }: { visits: VisitsSummaryDto[] }) => (
    <div className="chart">
        <ChartistGraph data={getData(visits)} options={chartOptions} type={"Line"} />
    </div>
);
