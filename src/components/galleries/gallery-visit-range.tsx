import React from "react";
import {Icon, DateRangePicker, Checkbox} from "rsuite";

interface Props{
    onRangeChange: (ranges: Date[]) => void;
    startDate: Date;
    endDate: Date;
}

export const GalleryVisitRange = (props: Props) => <div className="range">
    <span className="auto">
        <Icon icon="magic"/>
        <Checkbox/>
    </span>
    
    <DateRangePicker appearance="subtle" value={[props.startDate, props.endDate]} cleanable={false} onChange={props.onRangeChange}/>
</div>