import React from "react";
import { Icon, DateRangePicker, Button, Tooltip, Whisper } from "rsuite";

interface Props {
    onRangeChange: (ranges: [(Date | undefined)?, (Date | undefined)?]) => void;
    startDate: Date;
    endDate: Date;
    autoDisabled: boolean;
    onAutoChanged: () => void;
}

const enabledTooltip = <Tooltip>Date <i>will</i> be set automatically</Tooltip>;
const disabledTooltip = <Tooltip>Date <i>will not</i> be set automatically</Tooltip>;

export const GalleryVisitRange = (props: Props) => <div className="range">
    <Whisper trigger="hover" delayShow={1000} placement="topStart" speaker={props.autoDisabled ? disabledTooltip : enabledTooltip}>
        <Button size="lg" onClick={props.onAutoChanged} className="auto">
            <Icon className={props.autoDisabled ? "disabled" : ""} icon="magic" />
        </Button>
    </Whisper>

    <DateRangePicker appearance="subtle" value={[props.startDate, props.endDate]} cleanable={false} onChange={props.onRangeChange} />
</div>