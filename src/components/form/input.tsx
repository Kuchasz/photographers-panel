import { FormLabel } from "./label";

export const FormInput = ({
    label,
    name,
    type = "text",
    value,
    required = false,
    minDate,
    className = "",
}: {
    label: string;
    name: string;
    type?: string;
    value: string;
    required?: boolean;
    minDate?: string;
    className?: string;
}) => {
    const isTextarea = type === "textarea";
    const InputComponent = isTextarea ? "textarea" : "input";

    return (
        <div className="space-y-1.5">
            <FormLabel htmlFor={name} required={required}>
                {label}
            </FormLabel>
            <InputComponent
                id={name}
                type={isTextarea ? undefined : type}
                name={name}
                defaultValue={value}
                min={type === "date" ? minDate : undefined}
                className={`w-full rounded-lg border border-stone-200 bg-white px-4 py-3 font-light text-stone-800 transition 
                    placeholder:text-stone-400 hover:border-stone-300 focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-300
                    ${isTextarea ? "h-32 resize-none" : ""} ${className}`}
                required={required}
            />
        </div>
    );
};