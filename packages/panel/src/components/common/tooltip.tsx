import { Tooltip, Whisper } from 'rsuite';
import React from 'react';
import { type TypeAttributes } from 'rsuite/esm/internals/types';

interface ToolTipProps {
    placement?: TypeAttributes.Placement;
    text: React.ReactNode;
    children: React.ReactNode;
}

export const ToolTip: React.FC<ToolTipProps> = ({ children, placement, text }) => (
    <Whisper trigger="hover" placement={placement} delay={750} speaker={<Tooltip>{text}</Tooltip>}>
        {children}
    </Whisper>
);
