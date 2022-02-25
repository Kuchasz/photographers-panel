import * as React from "react";
import { addMonths } from "@pp/utils/dist/date";
import { ChartStat } from "../stats-chart/stats";
import { getSiteVisits, SiteVisitsDto } from "@pp/api/dist/panel/site";
import { Panel } from "rsuite";
import { StatsChart } from "../stats-chart";
import { translations } from "../../i18n";
import "./styles.less";

const getStats = (x: SiteVisitsDto): ChartStat[] => [
    { label: translations.site.stats.todayVisits, value: x.todayVisits },
    { label: translations.site.stats.totalVisits, value: x.totalVisits },
    { label: translations.site.stats.rangeVisits, value: x.rangeVisits },
    { label: translations.site.stats.bestDay, value: x.bestDay.date || '---' },
    { label: translations.site.stats.bestDayVisits, value: x.bestDay.visits },
];

interface Props {}

interface State {}

export class SiteStats extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="page-stats">
                <Panel>
                    <StatsChart
                        fetchChartStatsData={async (s, e, i) => {
                            const result = await getSiteVisits(s, e);
                            const stats = getStats(result);
                            const data = result.dailyVisits.map((dv) => ({
                                date: dv.date,
                                value: dv.visits,
                            }));
                            return { data, stats };
                        }}
                        selectedItem={{
                            id: 0,
                            date: addMonths(new Date(), -1).toDateString(),
                        }}
                    />
                </Panel>
            </div>
        );
    }
}
