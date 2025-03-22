'use client';

import React from "react";
import Image from "next/image";
import { strings } from "~/resources";
import { sendMessage } from "./actions";
import { type SendResult } from "~/areas/message";
import { PageContainer } from "~/components/page-container";
import { Label } from "~/components/form";

type ContactFormData = {
    name: string;
    email: string;
    weddingDate: string;
    weddingPlace: string;
    weddingVenue: string;
    howDidYouHear: string;
    additionalDetails: string;
};

// Form input component for consistent styling
const FormInput = ({ 
    label, 
    name, 
    type = "text", 
    value, 
    onChange, 
    disabled, 
    required = false,
    minDate,
    className = "",
}: {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    disabled: boolean;
    required?: boolean;
    minDate?: string;
    className?: string;
}) => {
    const isTextarea = type === "textarea";
    const InputComponent = isTextarea ? "textarea" : "input";
    
    return (
        <div className="space-y-1.5">
            <Label htmlFor={name} required={required}>
                {label}
            </Label>
            <InputComponent
                id={name}
                type={isTextarea ? undefined : type}
                name={name}
                value={value}
                disabled={disabled}
                onChange={onChange}
                min={type === "date" ? minDate : undefined}
                className={`w-full rounded-lg border border-stone-200 bg-white px-4 py-3 font-light text-stone-800 transition 
                    placeholder:text-stone-400 hover:border-stone-300 focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-300
                    ${isTextarea ? "h-32 resize-none" : ""} ${className}`}
                required={required}
            />
        </div>
    );
};

// Section heading component
const SectionHeading = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-medium text-stone-800 border-b border-stone-100 pb-2 mb-4">
        {children}
    </h3>
);

export default function ContactPage() {
    const [formData, setFormData] = React.useState<ContactFormData>({
        name: '',
        email: '',
        weddingDate: '',
        weddingPlace: '',
        weddingVenue: '',
        howDidYouHear: '',
        additionalDetails: '',
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [result, setResult] = React.useState<SendResult>();
    
    // Get today's date in YYYY-MM-DD format for the min attribute of the date input
    const today = new Date().toISOString().split('T')[0];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        // Check if wedding date is not in the past
        if (formData.weddingDate) {
            const selectedDate = new Date(formData.weddingDate);
            const currentDate = new Date();
            
            // Reset time to compare only dates
            currentDate.setHours(0, 0, 0, 0);
            
            if (selectedDate < currentDate) {
                return false;
            }
        }
        
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            alert(strings.contact.form.pastDateError);
            return;
        }
        
        setIsLoading(true);
        try {
            const response = await sendMessage(formData);
            setResult(response);
            if (response.type === 'success') {
                setFormData({
                    name: '',
                    email: '',
                    weddingDate: '',
                    weddingPlace: '',
                    weddingVenue: '',
                    howDidYouHear: '',
                    additionalDetails: '',
                });
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageContainer>
            <div className="max-w-7xl mx-auto space-y-16">
                {/* Info and photo section */}
                <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
                    {/* Contact information */}
                    <div className="space-y-8">
                        <header className="space-y-5">
                            <h1 className="font-serif text-4xl font-light tracking-wide text-stone-800 md:text-5xl lg:text-6xl">
                                {strings.contact.slogan.title}
                            </h1>
                            <h2 className="text-xl font-light italic tracking-wide text-stone-600">
                                {strings.contact.slogan.description}
                            </h2>
                        </header>

                        <div className="space-y-6 text-lg font-light text-stone-600">
                            <div className="space-y-2">
                                <p className="font-medium text-stone-800">{strings.contact.addressLabel}</p>
                                {strings.contact.address.map((line) => (
                                    <p key={line}>{line}</p>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <p>
                                    <span className="font-medium text-stone-800">{strings.contact.emailLabel}</span>{' '}
                                    {strings.contact.email}
                                </p>
                                <p>
                                    <span className="font-medium text-stone-800">{strings.contact.phoneLabel}</span>{' '}
                                    {strings.contact.phone}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact photo */}
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100 shadow-lg md:aspect-auto md:h-[400px]">
                        <Image
                            src="/images/page_contact_photo.png"
                            alt="Contact"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </div>
                </div>

                {/* Form section */}
                <div>
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 md:p-8">
                            <h2 className="text-2xl font-serif font-light text-stone-800 mb-8 text-center">
                                Napisz do nas
                            </h2>
                            
                            <form className="relative space-y-8" onSubmit={e => e.preventDefault()}>
                                {isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm z-10">
                                        <div className="flex flex-col items-center space-y-3">
                                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-stone-800"></div>
                                            <p className="text-lg font-light text-stone-800">
                                                {strings.contact.form.sendingMessage}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {result && (
                                    <div className={`rounded-lg border p-4 ${result.type === 'success'
                                        ? 'border-green-100 bg-green-50 text-green-800'
                                        : 'border-red-100 bg-red-50 text-red-800'
                                        }`}>
                                        <p className="text-sm">
                                            {result.type === 'success'
                                                ? strings.contact.form.messageSent
                                                : `${strings.contact.form.messsageNotSent}, ${strings.contact.form.errors[result.error]}`}
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-5">
                                    <SectionHeading>Informacje kontaktowe</SectionHeading>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormInput
                                            label={strings.contact.form.name}
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                            required
                                            className="md:col-span-2"
                                        />
                                        <FormInput
                                            label={strings.contact.form.email}
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                            required
                                            className="md:col-span-2"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <SectionHeading>Informacje o weselu</SectionHeading>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormInput
                                            label={strings.contact.form.weddingDate}
                                            name="weddingDate"
                                            type="date"
                                            value={formData.weddingDate}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                            minDate={today}
                                        />
                                        <FormInput
                                            label={strings.contact.form.weddingPlace}
                                            name="weddingPlace"
                                            value={formData.weddingPlace}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                        />
                                        <FormInput
                                            label={strings.contact.form.weddingVenue}
                                            name="weddingVenue"
                                            value={formData.weddingVenue}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                            className="md:col-span-2"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <SectionHeading>Dodatkowe informacje</SectionHeading>
                                    <div className="grid gap-4">
                                        <FormInput
                                            label={strings.contact.form.howDidYouHear}
                                            name="howDidYouHear"
                                            value={formData.howDidYouHear}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                        />
                                        <FormInput
                                            label={strings.contact.form.additionalDetails}
                                            name="additionalDetails"
                                            type="textarea"
                                            value={formData.additionalDetails}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-6 md:flex-row md:items-center md:justify-between md:space-y-0">
                                    <div className="text-sm font-light text-stone-600">
                                        <span className="text-red-500">*</span> {strings.contact.form.requiredField}
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        className="self-start rounded-lg border-2 border-stone-200 bg-white px-8 py-3 font-light text-stone-800 transition 
                                        hover:border-stone-300 hover:bg-stone-50 hover:shadow-lg disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-stone-300"
                                    >
                                        {strings.contact.form.submit}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
