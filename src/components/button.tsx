import React from "react";

interface ButtonProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'hero' | 'outline';
}

export const Button = ({
    href,
    children,
    className = "",
    variant = 'default'
}: ButtonProps) => {
    // Common styles for all variants
    const commonStyles = "inline-block rounded-md font-medium uppercase tracking-wide transition duration-300 hover:shadow-md px-8 py-3";
    
    // Variant-specific styles
    const variantStyles = 
        variant === 'hero' 
            ? "bg-gold-500/90 text-white font-light hover:bg-gold-600" 
            : variant === 'outline'
                ? "border border-gold-500 text-gold-600 hover:bg-gold-50"
                : "bg-gold-500 text-white hover:bg-gold-600";

    return (
        <a
            href={href}
            className={`${commonStyles} ${variantStyles} ${className}`.trim()}
        >
            {children}
        </a>
    );
}; 