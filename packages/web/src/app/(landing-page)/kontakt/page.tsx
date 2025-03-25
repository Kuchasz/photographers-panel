'use client';

import Image from "next/image";
import React, { useActionState } from "react";
import { FormButton } from "~/components/form/button";
import { FormInput } from "~/components/form/input";
import { PageContainer } from "~/components/page-container";
import { SectionTitle } from "~/components/section-title";
import { strings } from "~/resources";
import { sendMessage, type ContactState } from "./actions";

// Section heading component
const SectionHeading = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-medium text-stone-800 border-b border-stone-100 pb-2 mb-4">
        {children}
    </h3>
);

export default function ContactPage() {
    // Get today's date in YYYY-MM-DD format for the min attribute of the date input
    const today = new Date().toISOString().split('T')[0];

    const initialState: ContactState = {
        formData: {
            name: '',
            email: '',
            weddingDate: '',
            weddingPlace: '',
            weddingVenue: '',
            howDidYouHear: '',
            additionalDetails: '',
        },
        isSubmitting: false
    };

    const [state, formAction] = useActionState(sendMessage, initialState);

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
                        {/* @ts-expect-error - Next.js Image component type issue in Next.js App Router */}
                        <Image
                            src="/images/page_contact_photo.png"
                            alt={strings.contact.slogan.title}
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
                            <SectionTitle 
                                title={strings.contact.form.title}
                                subtitle=""
                                className="mb-8"
                            />

                            <form action={formAction} className="relative space-y-8">
                                {state.result && (
                                    <div className={`rounded-lg border p-4 ${state.result.type === 'success'
                                        ? 'border-green-100 bg-green-50 text-green-800'
                                        : 'border-red-100 bg-red-50 text-red-800'
                                        }`}>
                                        <p className="text-sm">
                                            {state.result.type === 'success'
                                                ? strings.contact.form.messageSent
                                                : `${strings.contact.form.messsageNotSent}, ${strings.contact.form.errors[state.result.error]}`}
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-5">
                                    <SectionHeading>Informacje kontaktowe</SectionHeading>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormInput
                                            label={strings.contact.form.name}
                                            name="name"
                                            value={state.formData.name}
                                            required
                                            className="md:col-span-2"
                                        />
                                        <FormInput
                                            label={strings.contact.form.email}
                                            name="email"
                                            type="email"
                                            value={state.formData.email}
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
                                            value={state.formData.weddingDate ?? ''}

                                            minDate={today}
                                        />
                                        <FormInput
                                            label={strings.contact.form.weddingPlace}
                                            name="weddingPlace"
                                            value={state.formData.weddingPlace ?? ''}

                                        />
                                        <FormInput
                                            label={strings.contact.form.weddingVenue}
                                            name="weddingVenue"
                                            value={state.formData.weddingVenue ?? ''}

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
                                            value={state.formData.howDidYouHear ?? ''}

                                        />
                                        <FormInput
                                            label={strings.contact.form.additionalDetails}
                                            name="additionalDetails"
                                            type="textarea"
                                            value={state.formData.additionalDetails ?? ''}

                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-6 md:flex-row md:items-center md:justify-between md:space-y-0">
                                    <div className="text-sm font-light text-stone-600">
                                        <span className="text-red-500">*</span> {strings.contact.form.requiredField}
                                    </div>

                                    <FormButton
                                        loadingText={strings.contact.form.sendingMessage}
                                        fullWidth={false}
                                    >
                                        {strings.contact.form.submit}
                                    </FormButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
