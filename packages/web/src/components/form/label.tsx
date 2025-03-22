import React from "react";

type LabelProps = {
    htmlFor?: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
};

// Required field indicator component
const RequiredFieldIndicator = () => (
    <span className="ml-1 text-red-500" title="Pole wymagane">*</span>
);

export function FormLabel({ 
    htmlFor, 
    required = false, 
    children, 
    className = ""
}: LabelProps) {
    return (
        <label 
            htmlFor={htmlFor} 
            className={`block text-sm font-light text-stone-600 ${className}`}
        >
            {children}
            {required && <RequiredFieldIndicator />}
        </label>
    );
} 