'use client';

import React from "react";
import Image from "next/image";
import { ResultType } from "@pp/api/dist/common";
import { type SendResult } from "@pp/api/dist/site/message";
import { strings } from "~/resources";
import { sendMessage } from "./actions";

type ContactFormData = {
    name: string;
    email: string;
    content: string;
};

export default function ContactPage() {
    const [formData, setFormData] = React.useState<ContactFormData>({
        name: '',
        email: '',
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
            if (response.type === ResultType.Success) {
                setFormData(prev => ({ ...prev, content: '' }));
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
            <main className="container mx-auto px-4 py-16 md:py-24">
                <div className="mx-auto max-w-7xl">
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
                                    <div className={`rounded-lg border p-4 ${result.type === ResultType.Success
                                            ? 'border-green-100 bg-green-50 text-green-800'
                                            : 'border-red-100 bg-red-50 text-red-800'
                                        }`}>
                                        <p className="text-sm">
                                            {result.type === ResultType.Success
                                                ? strings.contact.form.messageSent
                                                : `${strings.contact.form.messsageNotSent}, ${strings.contact.form.errors[result.error]}`}
                                        </p>
                                    </div>
                                )}

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    disabled={isLoading}
                                    onChange={handleInputChange}
                                    placeholder={strings.contact.form.name}
                                    className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 font-light text-stone-800 transition placeholder:text-stone-400 hover:border-stone-300 focus:border-stone-400 focus:outline-none"
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    disabled={isLoading}
                                    onChange={handleInputChange}
                                    placeholder={strings.contact.form.email}
                                    className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 font-light text-stone-800 transition placeholder:text-stone-400 hover:border-stone-300 focus:border-stone-400 focus:outline-none"
                                    required
                                />
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    disabled={isLoading}
                                    onChange={handleInputChange}
                                    placeholder={strings.contact.form.content}
                                    className="h-32 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 font-light text-stone-800 transition placeholder:text-stone-400 hover:border-stone-300 focus:border-stone-400 focus:outline-none"
                                    required
                                />
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
                </div>
            </main>
        </div>
    );
}
