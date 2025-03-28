'use client';

import Image from "next/image";
import React, { useActionState } from "react";
import { FormButton } from "~/components/form/button";
import { FormInput } from "~/components/form/input";
import { PageContainer } from "~/components/page-container";
import { SectionTitle } from "~/components/section-title";
import { strings } from "~/resources";
import { sendMessage, type ContactState } from "./actions";
import { Clock, Calendar, Users } from "@phosphor-icons/react";

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
            {/* Hero Section */}
            <section className="w-full bg-section-background py-12 mb-12 rounded-lg shadow-sm">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
                        {/* Content Section */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h1 className="font-serif text-4xl font-light tracking-wide text-stone-800 md:text-5xl">
                                    {strings.contact.slogan.title}
                                </h1>
                                <h2 className="text-xl font-light text-stone-600 leading-relaxed">
                                    {strings.contact.contactUs.subtitle}
                                </h2>
                                <p className="font-light leading-relaxed text-stone-600">
                                    {strings.contact.contactUs.description}
                                </p>
                                <p className="font-light italic text-stone-600">
                                    {strings.contact.contactUs.checkAvailability}
                                </p>
                            </div>
                        </div>

                        {/* Contact Image */}
                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100 shadow-lg md:aspect-auto md:h-[400px]">
                            {/* @ts-expect-error - Next.js Image component type issue in Next.js App Router */}
                            <Image
                                src="/images/page_contact_photo.png"
                                alt={strings.contact.slogan.title}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-50"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What to Expect Section */}
            <section className="w-full py-12 mb-12">
                <div className="max-w-5xl mx-auto px-4">
                    <SectionTitle 
                        title="Co dalej?"
                        subtitle="Proces rezerwacji terminu"
                    />
                    
                    <div className="grid md:grid-cols-3 gap-8 my-12">
                        <div className="bg-white rounded-lg p-6 shadow-md border border-stone-100 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-100 text-gold-600 mb-4">
                                {/* @ts-expect-error - Icon component type issue */}
                                <Clock size={24} weight="light" />
                            </div>
                            <h3 className="text-xl font-medium text-stone-800 mb-3">Szybka odpowiedź</h3>
                            <p className="text-stone-600 font-light">Odpowiadamy na wiadomości w ciągu 24 godzin, aby potwierdzić dostępność terminu.</p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md border border-stone-100 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-100 text-gold-600 mb-4">
                                {/* @ts-expect-error - Icon component type issue */}
                                <Users size={24} weight="light" />
                            </div>
                            <h3 className="text-xl font-medium text-stone-800 mb-3">Spotkanie</h3>
                            <p className="text-stone-600 font-light">Umówimy się na osobiste lub online spotkanie, aby poznać Wasze oczekiwania.</p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md border border-stone-100 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-100 text-gold-600 mb-4">
                                {/* @ts-expect-error - Icon component type issue */}
                                <Calendar size={24} weight="light" />
                            </div>
                            <h3 className="text-xl font-medium text-stone-800 mb-3">Rezerwacja</h3>
                            <p className="text-stone-600 font-light">Po ustaleniu szczegółów podpisujemy umowę i rezerwujemy Wasz termin na wyłączność.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="w-full py-12 mb-8">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-md border border-stone-100 p-6 md:p-8">
                        <SectionTitle 
                            title={strings.contact.form.title}
                            subtitle="Wypełnij formularz, aby skontaktować się z nami"
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
            </section>
        </PageContainer>
    );
}
