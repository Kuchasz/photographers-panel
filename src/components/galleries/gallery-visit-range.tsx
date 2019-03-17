import React from "react";
import { Icon, DateRangePicker, Button } from "rsuite";

interface Props {
    onRangeChange: (ranges: Date[]) => void;
    startDate: Date;
    endDate: Date;
    autoDisabled: boolean;
    onAutoChanged: () => void;
}

export const GalleryVisitRange = (props: Props) => <div className="range">
    <Button onClick={props.onAutoChanged} className="auto">
        <Icon className={props.autoDisabled ? "disabled" : ""} icon="magic" />
    </Button>

    <DateRangePicker appearance="subtle" value={[props.startDate, props.endDate]} cleanable={false} onChange={props.onRangeChange} />
</div>