import Link from "next/link";
import { type ReactNode } from "react";

interface ButtonProps {
    href: string;
    children: ReactNode;
    className?: string;
    isExternal?: boolean;
}

export const Button = ({ href, children, className = "", isExternal = false }: ButtonProps) => {
    const baseClasses = "inline-block rounded-full border-2 border-stone-200 bg-white px-8 py-3 text-stone-800 transition duration-300 hover:border-stone-300 hover:bg-stone-50 hover:shadow-lg";
    
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