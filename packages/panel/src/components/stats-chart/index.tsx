import React from "react";
import { addMonths } from "@pp/utils/dist/date";
import { Chart, ChartData } from "./chart";
import { ChartStat, ChartStats } from "./stats";
import { StatsRange } from "./stats-range";
import "./styles.less";

type StatsItem = {
    id: number;
    date: string;
};

type ChartStatsData = {
    data: ChartData[];
    stats: ChartStat[];
};

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
            items: [],
        };
    }

    toggleAutoDate = () => {
        this.setState(({ disableAutoDate }) => ({
            disableAutoDate: !disableAutoDate,
        }));
    };

    componentDidMount() {
        if (!this.props.selectedItem) return;
        this.fetchStats();
    }

    componentDidUpdate?(prevProps: Readonly<Props<T>>) {
        if (prevProps.selectedItem?.id === this.props.selectedItem?.id) return;
        this.fetchStats();
    }

    fetchStats() {
        this.setState({ isLoading: true });

        const startDate = this.state.disableAutoDate ? this.state.startDate : new Date(this.props.selectedItem.date);
        const endDate = this.state.disableAutoDate
            ? this.state.endDate
            : addMonths(new Date(this.props.selectedItem.date), 1);

        this.props.fetchChartStatsData(startDate, endDate, this.props.selectedItem.id).then((resp) => {
            // console.log(resp.data);
            this.setState({
                isLoading: false,
                stats: resp.stats,
                items: resp.data,
                startDate,
                endDate,
            });
        });
    }

    onDateRangeChanged = ([startDate, endDate]: [(Date | undefined)?, (Date | undefined)?]) => {
        if (startDate === undefined || endDate === undefined) return;
        this.setState(() => ({ disableAutoDate: true, startDate, endDate }));
        if (this.props.selectedItem) {
            this.setState(() => ({
                isLoading: true,
            }));

            this.props.fetchChartStatsData(startDate, endDate, this.props.selectedItem.id).then((resp) => {
                // console.log(resp.data);
                this.setState({
                    isLoading: false,
                    stats: resp.stats,
                    items: resp.data,
                });
            });
        }
    };

    render() {
        return (
            <div className="stats-chart">
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
                            <ChartStats isLoading={this.state.isLoading} stats={this.state.stats} />
                        ) : null}
                    </span>
                </header>
                <Chart items={this.state.items}></Chart>
            </div>
        );
    }
}
