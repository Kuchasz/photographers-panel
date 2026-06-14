"use client";

import React from "react";
import { useFormStatus } from "react-dom";

interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loadingText?: string;
  fullWidth?: boolean;
}

export const FormButton = ({
  children,
  loadingText = "Sprawdzanie...",
  fullWidth = true,
  disabled,
  className,
  ...props
}: FormButtonProps) => {
  const { pending } = useFormStatus();

  const baseStyles = "rounded-lg cursor-pointer bg-stone-800 px-8 py-3 text-sm font-medium text-white transition duration-200 hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-stone-500";
  const widthStyles = fullWidth ? "w-full" : "";
  const combinedStyles = `${baseStyles} ${widthStyles} ${className ?? ""}`;

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={combinedStyles}
      {...props}
    >
      {pending ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
}; 
