import * as React from "react";
import { Panel } from "rsuite";
import "./styles.less";
import { getSiteVisits, SiteVisitsDto } from "@pp/api/panel/site";
import { StatsChart } from "../stats-chart";
import { ChartStat } from "../stats-chart/stats";
import { addMonths } from "@pp/utils/date";

const getStats = (x: SiteVisitsDto): ChartStat[] => [
    { label: "Today visits", value: x.todayVisits },
    { label: "Total visits", value: x.totalVisits },
    { label: "Range visits", value: x.rangeVisits },
    { label: "Best day", value: x.bestDay.date || '---' },
    { label: "Best day visits", value: x.bestDay.visits }
];

interface Props { }

interface State {
}

export class SiteStats extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div className="page-stats">
                <Panel>
                    <StatsChart fetchChartStatsData={async (s, e, i) => {
                        const result = await getSiteVisits(s, e);
                        const stats = getStats(result);
                        const data = result.dailyVisits.map(dv => ({ date: dv.date, value: dv.visits }));
                        return { data, stats };
                    }} selectedItem={{ id: 0, date: (addMonths(new Date(), -1).toDateString()) }} />
                </Panel>
            </div>
        );
    }
}
