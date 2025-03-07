import React from "react";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
};

/**
 * A unified container component for landing pages
 * Provides consistent padding, width constraints, and background styling
 */
export function PageContainer({
  children,
  className = "",
  fullWidth = false,
}: PageContainerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <main className={`container mx-auto px-4 py-16 md:py-24 ${className}`}>
        {fullWidth ? (
          children
        ) : (
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        )}
      </main>
    </div>
  );
} 