'use client';

import { Download } from '@phosphor-icons/react';
import { strings } from '../../resources';

type PhotoDownloadButtonProps = {
    url: string;
    onDownload?: (e: React.MouseEvent) => void;
    className?: string;
    variant?: 'light' | 'dark';
};

export function PhotoDownloadButton({ url, onDownload, className = '', variant = 'light' }: PhotoDownloadButtonProps) {
    const baseClasses = 'flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors cursor-pointer';
    const lightClasses = 'bg-white/20 hover:bg-white/40 text-white';
    const darkClasses = 'bg-black/20 hover:bg-black/40 text-white';
    const variantClasses = variant === 'dark' ? darkClasses : lightClasses;

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onDownload) {
            onDownload(e);
        }
    };

    return (
        <button
            type="button"
            className={`${baseClasses} ${variantClasses} ${className}`}
            aria-label={strings.gallery.download}
            onClick={handleClick}
        >
            <Download size={16} weight="bold" className="text-inherit" />
            <span className="text-xs text-inherit">{strings.gallery.download}</span>
        </button>
    );
} 