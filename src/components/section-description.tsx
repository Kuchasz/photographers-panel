import React from "react";

interface SectionDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

export const SectionDescription = ({ children, className = "" }: SectionDescriptionProps) => {
    return (
        <div className={`mx-auto max-w-2xl text-center px-4 ${className}`}>
            <p className="font-light leading-relaxed text-stone-600 mb-4">
                {children}
            </p>
        </div>
    );
}; 