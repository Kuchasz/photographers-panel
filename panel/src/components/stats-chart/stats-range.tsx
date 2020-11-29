import React from "react";
import { Icon, DateRangePicker, Button } from "rsuite";
import { ToolTip } from "../common/tooltip";

interface Props {
    onRangeChange: (ranges: [(Date | undefined)?, (Date | undefined)?]) => void;
    startDate: Date;
    endDate: Date;
    autoDisabled: boolean;
    onAutoChanged: () => void;
}

const enabledTooltip = <>Date <i>will</i> be set automatically</>;
const disabledTooltip = <>Date <i>will not</i> be set automatically</>;

export const StatsRange = (props: Props) => <div className="range">
    <ToolTip placement="topStart" text={props.autoDisabled ? disabledTooltip : enabledTooltip}>
        <Button size="lg" onClick={props.onAutoChanged} className="auto">
            <Icon className={props.autoDisabled ? "disabled" : ""} icon="magic" />
        </Button>
    </ToolTip>

    <DateRangePicker appearance="subtle" value={[props.startDate, props.endDate]} cleanable={false} onChange={props.onRangeChange} />
</div>