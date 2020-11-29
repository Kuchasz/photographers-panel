import React from "react";
import { StatsRange } from "./stats-range";
import { Chart, ChartData } from "./chart";
import { ChartStat, ChartStats } from "./stats";
import { addMonths } from "@pp/utils/date";

type StatsItem = {
    id: number;
};

type ChartStatsData = {
    data: ChartData[];
    stats: ChartStat[];
}

interface Props<Item extends StatsItem> {
    selectedItem: Item;
    fetchChartStatsData: (startDate: Date, endDate: Date, item: number) => Promise<ChartStatsData>;
}

interface State {
    isLoading: boolean;
    disableAutoDate: boolean;
    startDate: Date;
    endDate: Date;
    stats: ChartStat[];
    items: ChartData[];
}

export class StatsChart<T extends StatsItem> extends React.Component<Props<T>, State> {

    constructor(props: Props<T>) {
        super(props);
        this.state = {
            isLoading: false,
            disableAutoDate: false,
            startDate: addMonths(new Date(), -1),
            endDate: new Date(),
            stats: [],
            items: []
        };
    }

    toggleAutoDate = () => {
        this.setState(({ disableAutoDate }) => ({ disableAutoDate: !disableAutoDate }));
    };

    onDateRangeChanged = ([startDate, endDate]: [(Date | undefined)?, (Date | undefined)?]) => {
        if (startDate === undefined || endDate === undefined) return;
        this.setState(() => ({ disableAutoDate: true, startDate, endDate }));
        if (this.props.selectedItem) {
            this.setState((_state) => ({
                isLoading: true
            }));

            this.props.fetchChartStatsData(startDate, endDate, this.props.selectedItem.id).then((resp) =>
                this.setState({
                    isLoading: false,
                    stats: resp.stats,
                    items: resp.data
                })
            );
        }
    };

    render() {
        return <div>
            <header>
                <StatsRange
                    onAutoChanged={this.toggleAutoDate}
                    autoDisabled={this.state.disableAutoDate}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    onRangeChange={this.onDateRangeChanged}
                />
                <span>
                    {this.state.stats != null ? (
                        <ChartStats
                            isLoading={this.state.isLoading}
                            stats={this.state.stats} />
                    ) : null}
                </span>
            </header>
            <Chart items={this.state.items}></Chart>
        </div>;
    }
}