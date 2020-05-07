import { Tooltip, Whisper } from "rsuite";
import React from "react";
import { TypeAttributes } from "rsuite/lib/@types/common.d.ts";

interface ToolTipProps {
    placement?: TypeAttributes.Placement;
    text: React.ReactNode;
}

export const ToolTip: React.FC<ToolTipProps> = ({ children, placement, text }) => (
    <Whisper trigger="hover" placement={placement} delay={750} speaker={<Tooltip>{text}</Tooltip>}>
        {children}
    </Whisper>
);
