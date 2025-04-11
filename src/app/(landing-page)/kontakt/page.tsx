'use client';

import React, { useActionState } from "react";
import { FormButton } from "~/components/form/button";
import { FormInput } from "~/components/form/input";
import { PageContainer } from "~/components/page-container";
import { SectionTitle } from "~/components/section-title";
import { strings } from "~/resources";
import { sendMessage, type ContactState } from "./actions";
import { CalendarCheck, PresentationChart, CurrencyCircleDollar } from "@phosphor-icons/react";

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

    const [state, formAction] = useActionState(sendMessage, initialState);

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
                    <div className="mb-16 overflow-hidden rounded-lg shadow-lg">
                        <img
                            src="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=1200&h=600"
                            alt="Para młoda rozmawiająca z fotografem"
                            className="w-full object-cover h-[400px]"
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
            <section className="w-full py-12 mb-8 bg-section-background px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-md border border-stone-100 p-6 md:p-8">
                        <SectionTitle
                            title={strings.contact.form.title}
                            subtitle={strings.contact.formSubtitle}
                            className="mb-8"
                        />

                        <div className="grid md:grid-cols-5 gap-8 mb-8">
                            <div className="md:col-span-2 overflow-hidden rounded-lg">
                                <img
                                    src="https://images.unsplash.com/photo-1534131707746-25d604851a1f?q=80&w=400&h=600"
                                    alt="Skontaktuj się z nami"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                            <div className="md:col-span-3">
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
                                        <SectionHeading>{strings.contact.formSections.contactInfo}</SectionHeading>
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
                                        <SectionHeading>{strings.contact.formSections.weddingInfo}</SectionHeading>
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
                                        <SectionHeading>{strings.contact.formSections.additionalInfo}</SectionHeading>
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
            </section>
        </PageContainer>
    );
}
