import Link from "next/link";
import { type ReactNode } from "react";

interface ButtonProps {
    href: string;
    children: ReactNode;
    className?: string;
    isExternal?: boolean;
}

export const Button = ({ href, children, className = "", isExternal = false }: ButtonProps) => {
    const baseClasses = "inline-block rounded-md bg-gold-500 px-8 py-3 font-medium text-white uppercase tracking-wide transition duration-300 hover:bg-gold-600 hover:shadow-md";
    
    const linkProps = isExternal ? {
        target: "_blank",
        rel: "noopener noreferrer"
    } : {};

    return (
        <Link
            href={href}
            className={`${baseClasses} ${className}`.trim()}
            {...linkProps}
        >
            {children}
        </Link>
    );
}; 