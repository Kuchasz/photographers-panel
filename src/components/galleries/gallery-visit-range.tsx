import React from "react";
import { Icon, DateRangePicker } from "rsuite";

interface Props {
    onRangeChange: (ranges: Date[]) => void;
    startDate: Date;
    endDate: Date;
    autoDisabled: boolean;
    onAutoChanged: () => void;
}

export const GalleryVisitRange = (props: Props) => <div className="range">
    <span className="auto">
        <Icon onClick={props.onAutoChanged} className={props.autoDisabled ? "disabled" : ""} icon="magic" />
    </span>

    <DateRangePicker appearance="subtle" value={[props.startDate, props.endDate]} cleanable={false} onChange={props.onRangeChange} />
</div>