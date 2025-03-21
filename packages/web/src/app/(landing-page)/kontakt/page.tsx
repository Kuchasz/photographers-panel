'use client';

import React from "react";
import Image from "next/image";
import { strings } from "~/resources";
import { sendMessage } from "./actions";
import { type SendResult } from "~/areas/message";
import { PageContainer } from "~/components/page-container";

type ContactFormData = {
    name: string;
    email: string;
    weddingDate: string;
    weddingPlace: string;
    weddingVenue: string;
    howDidYouHear: string;
    additionalDetails: string;
    content: string;
};

// First, create a required field label component
const RequiredFieldIndicator = () => (
    <span className="ml-1 text-red-500" title={strings.contact.form.requiredField}>*</span>
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
        content: ''
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [result, setResult] = React.useState<SendResult>();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await sendMessage(formData);
            setResult(response);
            if (response.type === 'success') {
                setFormData(prev => ({ ...prev, content: '' }));
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageContainer>
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
                <div className="space-y-12">
                    <header className="space-y-6">
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

                        <div>
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

                    <form className="relative space-y-6" onSubmit={e => e.preventDefault()}>
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/75">
                                <p className="text-lg font-light text-stone-800">
                                    {strings.contact.form.sendingMessage}
                                </p>
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

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-stone-800">Informacje kontaktowe</h3>
                            <div className="space-y-1">
                                <label className="block text-sm font-light text-stone-600">
                                    {strings.contact.form.name}
                                    <RequiredFieldIndicator />
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    disabled={isLoading}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 font-light text-stone-800 transition placeholder:text-stone-400 hover:border-stone-300 focus:border-stone-400 focus:outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-sm font-light text-stone-600">
                                    {strings.contact.form.email}
                                    <RequiredFieldIndicator />
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    disabled={isLoading}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 font-light text-stone-800 transition placeholder:text-stone-400 hover:border-stone-300 focus:border-stone-400 focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-stone-800">Informacje o weselu</h3>
                            <div className="space-y-1">
                                <label className="block text-sm font-light text-stone-600">
                                    {strings.contact.form.weddingDate}
                                </label>
                                <input
                                    type="date"
                                    name="weddingDate"
                                    value={formData.weddingDate}
                                    disabled={isLoading}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 font-light text-stone-800 transition placeholder:text-stone-400 hover:border-stone-300 focus:border-stone-400 focus:outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-sm font-light text-stone-600">
                                    {strings.contact.form.weddingPlace}
                                </label>
                                <input
                                    type="text"
                                    name="weddingPlace"
                                    value={formData.weddingPlace}
                                    disabled={isLoading}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 font-light text-stone-800 transition placeholder:text-stone-400 hover:border-stone-300 focus:border-stone-400 focus:outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-sm font-light text-stone-600">
                                    {strings.contact.form.weddingVenue}
                                </label>
                                <input
                                    type="text"
                                    name="weddingVenue"
                                    value={formData.weddingVenue}
                                    disabled={isLoading}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 font-light text-stone-800 transition placeholder:text-stone-400 hover:border-stone-300 focus:border-stone-400 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-stone-800">Dodatkowe informacje</h3>
                            <div className="space-y-1">
                                <label className="block text-sm font-light text-stone-600">
                                    {strings.contact.form.howDidYouHear}
                                </label>
                                <input
                                    type="text"
                                    name="howDidYouHear"
                                    value={formData.howDidYouHear}
                                    disabled={isLoading}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 font-light text-stone-800 transition placeholder:text-stone-400 hover:border-stone-300 focus:border-stone-400 focus:outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-sm font-light text-stone-600">
                                    {strings.contact.form.additionalDetails}
                                </label>
                                <textarea
                                    name="additionalDetails"
                                    value={formData.additionalDetails}
                                    disabled={isLoading}
                                    onChange={handleInputChange}
                                    className="h-32 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 font-light text-stone-800 transition placeholder:text-stone-400 hover:border-stone-300 focus:border-stone-400 focus:outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-sm font-light text-stone-600">
                                    {strings.contact.form.content}
                                    <RequiredFieldIndicator />
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    disabled={isLoading}
                                    onChange={handleInputChange}
                                    className="h-32 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 font-light text-stone-800 transition placeholder:text-stone-400 hover:border-stone-300 focus:border-stone-400 focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="text-sm font-light text-stone-600">
                            <RequiredFieldIndicator /> {strings.contact.form.requiredField}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="rounded-lg border-2 border-stone-200 bg-white px-8 py-3 font-light text-stone-800 transition hover:border-stone-300 hover:bg-stone-50 hover:shadow-lg disabled:opacity-50"
                        >
                            {strings.contact.form.submit}
                        </button>
                    </form>
                </div>

                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-stone-100 shadow-lg lg:aspect-auto">
                    <Image
                        src="/images/page_contact_photo.png"
                        alt="Contact"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                    />
                </div>
            </div>
        </PageContainer>
    );
}
