'use client';

import React, { useActionState } from "react";
import { FormButton } from "~/components/form/button";
import { FormInput } from "~/components/form/input";
import { PageContainer } from "~/components/page-container";
import { SectionTitle } from "~/components/section-title";
import { strings } from "~/resources";
import { sendMessage, type ContactState } from "./actions";
import { CalendarCheck, PresentationChart, CurrencyCircleDollar, Phone, Envelope, InstagramLogo, FacebookLogo } from "@phosphor-icons/react";
import Image from "next/image";

// Section heading component - this is just a UI component, not a directly translatable piece
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

    const [contactFormState, contactFormAction] = useActionState(sendMessage, initialState);

    return (
        <PageContainer>
            {/* Featured Image */}
            <section className="w-full">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="mb-8 text-center">
                        <SectionTitle
                            title={strings.contact.reservation.title}
                            subtitle={strings.contact.reservation.subtitle}
                        />
                        <p className="mx-auto max-w-3xl font-light leading-relaxed text-stone-600 mt-6">
                            Jesteśmy gotowi, aby uwiecznić Wasz wyjątkowy dzień. Skontaktuj się z nami, aby sprawdzić dostępność terminu i omówić szczegóły współpracy.
                        </p>
                    </div>

                    {/* Featured Image */}
                    <div className="mb-16 overflow-hidden rounded-lg shadow-lg relative h-[400px]">
                        <Image
                            src="/images/page_kontakt_photo.jpg"
                            alt="Para młoda rozmawiająca z fotografem"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="w-full pb-16 rounded-lg">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 my-12">
                        <div className="bg-white rounded-lg overflow-hidden shadow-md border border-stone-100 hover:shadow-lg transition-all">
                            <div className="p-6 text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-100 text-gold-600 mb-4">
                                    <CalendarCheck size={24} weight="light" />
                                </div>
                                <h3 className="text-xl font-medium text-stone-800 mb-3">{strings.contact.reservation.steps?.[0]?.title ?? 'Ustalenie terminu'}</h3>
                                <p className="text-stone-600 font-light">{strings.contact.reservation.steps?.[0]?.description ?? 'Sprawdzamy dostępność i potwierdzamy termin Waszej uroczystości. Kontaktujemy się w ciągu 24 godzin.'}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg overflow-hidden shadow-md border border-stone-100 hover:shadow-lg transition-all">
                            <div className="p-6 text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-100 text-gold-600 mb-4">
                                    <PresentationChart size={24} weight="light" />
                                </div>
                                <h3 className="text-xl font-medium text-stone-800 mb-3">{strings.contact.reservation.steps?.[1]?.title ?? 'Prezentacja oferty'}</h3>
                                <p className="text-stone-600 font-light">{strings.contact.reservation.steps?.[1]?.description ?? 'Spotykamy się osobiście lub online, aby przedstawić naszą ofertę i dopasować pakiet do Waszych oczekiwań.'}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg overflow-hidden shadow-md border border-stone-100 hover:shadow-lg transition-all">
                            <div className="p-6 text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-100 text-gold-600 mb-4">
                                    <CurrencyCircleDollar size={24} weight="light" />
                                </div>
                                <h3 className="text-xl font-medium text-stone-800 mb-3">{strings.contact.reservation.steps?.[2]?.title ?? 'Zaliczka i rezerwacja'}</h3>
                                <p className="text-stone-600 font-light">{strings.contact.reservation.steps?.[2]?.description ?? 'Podpisujemy umowę i przyjmujemy zaliczkę, która gwarantuje rezerwację terminu wyłącznie dla Was.'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section id="formularz" className="w-full scroll-mt-24 py-12 mb-8 bg-section-background px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-md border border-stone-100 p-6 md:p-8">
                        <SectionTitle
                            title={strings.contact.form.title}
                            subtitle={strings.contact.formSubtitle}
                            className="mb-8"
                        />

                        <form action={contactFormAction} className="relative space-y-8">
                            {contactFormState.result && (
                                <div className={`rounded-xl border p-8 text-center ${contactFormState.result.type === 'success'
                                    ? 'border-green-100 bg-green-50 text-green-800'
                                    : 'border-red-100 bg-red-50 text-red-800'}`}>
                                    <h3 className="text-xl font-medium mb-4">
                                        {contactFormState.result.type === 'success'
                                            ? strings.contact.form.success.title
                                            : strings.contact.form.error.title}
                                    </h3>
                                    <p className="text-base">
                                        {contactFormState.result.type === 'success'
                                            ? strings.contact.form.success.message
                                            : strings.contact.form.error.message}
                                    </p>
                                    {contactFormState.result.type === 'error' && (
                                        <div className="mt-8 space-y-4">
                                            <a
                                                href={strings.contact.form.error.contactMethods.phone.href}
                                                className="flex items-center space-x-3 text-stone-700 bg-white p-3 rounded-lg shadow-sm border border-red-50 hover:bg-red-50 transition-colors"
                                            >
                                                <Phone size={20} weight="light" className="text-red-500" />
                                                <span>{strings.contact.form.error.contactMethods.phone.text}</span>
                                            </a>
                                            <a
                                                href={strings.contact.form.error.contactMethods.email.href}
                                                className="flex items-center space-x-3 text-stone-700 bg-white p-3 rounded-lg shadow-sm border border-red-50 hover:bg-red-50 transition-colors"
                                            >
                                                <Envelope size={20} weight="light" className="text-red-500" />
                                                <span>{strings.contact.form.error.contactMethods.email.text}</span>
                                            </a>
                                            <a
                                                href={strings.contact.form.error.contactMethods.facebook.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-3 text-stone-700 bg-white p-3 rounded-lg shadow-sm border border-red-50 hover:bg-red-50 transition-colors"
                                            >
                                                <FacebookLogo size={20} weight="light" className="text-red-500" />
                                                <span>{strings.contact.form.error.contactMethods.facebook.text}</span>
                                            </a>
                                            <a
                                                href={strings.contact.form.error.contactMethods.instagram.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-3 text-stone-700 bg-white p-3 rounded-lg shadow-sm border border-red-50 hover:bg-red-50 transition-colors"
                                            >
                                                <InstagramLogo size={20} weight="light" className="text-red-500" />
                                                <span>{strings.contact.form.error.contactMethods.instagram.text}</span>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}

                            {(!contactFormState.result) && (
                                <>
                                    <div className="space-y-5">
                                        <SectionHeading>{strings.contact.formSections.contactInfo}</SectionHeading>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <FormInput
                                                label={strings.contact.form.name}
                                                name="name"
                                                value={contactFormState.formData.name}
                                                required
                                                className="md:col-span-2"
                                            />
                                            <FormInput
                                                label={strings.contact.form.email}
                                                name="email"
                                                type="email"
                                                value={contactFormState.formData.email}
                                                required
                                                className="md:col-span-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        <SectionHeading>{strings.contact.formSections.weddingInfo}</SectionHeading>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <FormInput
                                                label={strings.contact.form.weddingDate}
                                                name="weddingDate"
                                                required
                                                type="date"
                                                value={contactFormState.formData.weddingDate ?? ''}
                                                minDate={today}
                                            />
                                            <FormInput
                                                label={strings.contact.form.weddingPlace}
                                                name="weddingPlace"
                                                value={contactFormState.formData.weddingPlace ?? ''}
                                            />
                                            <FormInput
                                                label={strings.contact.form.weddingVenue}
                                                name="weddingVenue"
                                                value={contactFormState.formData.weddingVenue ?? ''}
                                                className="md:col-span-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        <SectionHeading>{strings.contact.formSections.additionalInfo}</SectionHeading>
                                        <div className="grid gap-4">
                                            <FormInput
                                                label={strings.contact.form.howDidYouHear}
                                                name="howDidYouHear"
                                                value={contactFormState.formData.howDidYouHear ?? ''}
                                            />
                                            <FormInput
                                                label={strings.contact.form.additionalDetails}
                                                name="additionalDetails"
                                                type="textarea"
                                                value={contactFormState.formData.additionalDetails ?? ''}
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
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </section>
        </PageContainer>
    );
}
