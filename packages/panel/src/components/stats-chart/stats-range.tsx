import React from 'react';
import { DateRangePicker, Button } from 'rsuite';
import { ToolTip } from '../common/tooltip';
import { type ValueType } from 'rsuite/esm/DateRangePicker';
import { MagicWand } from '@phosphor-icons/react';

interface Props {
    onRangeChange: (value: ValueType, event: React.SyntheticEvent) => void;
    startDate: Date;
    endDate: Date;
    autoDisabled: boolean;
    onAutoChanged: () => void;
}

const enabledTooltip = (
    <>
        Date <i>will</i> be set automatically
    </>
);
const disabledTooltip = (
    <>
        Date <i>will not</i> be set automatically
    </>
);

export const StatsRange = (props: Props) => (
    <div className="range">
        <ToolTip placement="topStart" text={props.autoDisabled ? disabledTooltip : enabledTooltip}>
            <Button size="lg" onClick={props.onAutoChanged} className="auto">
                <MagicWand className={props.autoDisabled ? 'disabled' : ''} />
            </Button>
        </ToolTip>

        <DateRangePicker
            appearance="subtle"
            value={[props.startDate, props.endDate]}
            cleanable={false}
            onChange={props.onRangeChange}
        />
    </div>
);
