import React from "react";

interface ButtonProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'hero';
}

export const Button = ({
    href,
    children,
    className = "",
    variant = 'default'
}: ButtonProps) => {
    const baseClasses = variant === 'hero'
        ? "inline-block px-8 py-3 bg-gold-500/90 text-white font-light tracking-wide uppercase hover:bg-gold-600 transition-colors duration-300"
        : "inline-block rounded-md bg-gold-500 px-8 py-3 font-medium text-white uppercase tracking-wide transition duration-300 hover:bg-gold-600 hover:shadow-md";


    return (
        <a
            href={href}
            className={`${baseClasses} ${className}`.trim()}
        >
            {children}
        </a>
    );
}; 