import React from "react";
import { PageContainer } from "~/components/page-container";
import { SectionTitle } from "~/components/section-title";
import { Button } from "~/components/button";
import { routes } from "~/routes";
import Image from "next/image";
import { pl } from "~/resources/pl";

export default async function OffersPage() {
    return (
        <PageContainer>
            {/* Wedding Offer Section */}
            <section className="w-full pb-8 md:pb-12">
                <SectionTitle
                    title={pl.offerPage.weddingOffer.title}
                    subtitle={pl.offerPage.weddingOffer.subtitle}
                />

                <div className="mx-auto max-w-4xl">
                    <div className="mb-12 text-center">
                        <p className="mx-auto max-w-3xl font-light leading-relaxed text-stone-600 mb-4">
                            {pl.offerPage.weddingOffer.description}
                        </p>
                    </div>

                    {/* Featured Image */}
                    <div className="mb-16 overflow-hidden rounded-lg shadow-lg relative h-[400px]">
                        <Image
                            src="/images/page_oferta_photo.jpg"
                            alt={pl.offerPage.weddingOffer.imageAlt}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Offer Details Section */}
                    <div className="grid gap-12 md:grid-cols-2 mb-16">
                        {/* Photography Column */}
                        <div className="bg-section-background rounded-lg p-8 shadow-md">
                            <h3 className="mb-6 font-serif text-2xl font-medium text-stone-800 border-b border-gold-200 pb-2">
                                {pl.offerPage.weddingOffer.photos.title}
                            </h3>
                            <ul className="space-y-4">
                                {pl.offerPage.weddingOffer.photos.items.map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="mr-3 text-gold-500">✓</span>
                                        <span className="font-light text-stone-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Video Column */}
                        <div className="bg-section-background rounded-lg p-8 shadow-md">
                            <h3 className="mb-6 font-serif text-2xl font-medium text-stone-800 border-b border-gold-200 pb-2">
                                {pl.offerPage.weddingOffer.video.title}
                            </h3>
                            <ul className="space-y-4">
                                {pl.offerPage.weddingOffer.video.items.map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="mr-3 text-gold-500">✓</span>
                                        <span className="font-light text-stone-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Included in price */}
                    <div className="mb-16">
                        <h3 className="mb-6 font-serif text-2xl font-medium text-stone-800 text-center">
                            {pl.offerPage.weddingOffer.included.title}
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {pl.offerPage.weddingOffer.included.items.map((item, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-stone-100">
                                    <div className="flex items-center">
                                        <span className="mr-3 text-gold-400">❤</span>
                                        <span className="font-light text-stone-700">{item}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Additional options */}
                    <div className="mb-16">
                        <h3 className="mb-6 font-serif text-2xl font-medium text-stone-800 text-center">
                            {pl.offerPage.weddingOffer.additional.title}
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {pl.offerPage.weddingOffer.additional.items.map((item, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-stone-100">
                                    <div className="flex items-center">
                                        <span className="mr-3 text-gold-400">+</span>
                                        <span className="font-light text-stone-700">{item}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Why choose us */}
                    <div className="mb-16">
                        <h3 className="mb-8 font-serif text-2xl font-medium text-stone-800 text-center">
                            {pl.offerPage.weddingOffer.whyChooseUs.title}
                        </h3>

                        {/* Introduction paragraph */}
                        <div className="mb-8 text-center">
                            <p className="mx-auto max-w-3xl font-light italic text-stone-700 mb-4">
                                {pl.offerPage.weddingOffer.whyChooseUs.intro}
                            </p>
                        </div>

                        {/* All advantages in expanded list */}
                        <div className="bg-section-background rounded-lg p-8 shadow-md">
                            <ul className="space-y-4">
                                {pl.offerPage.weddingOffer.whyChooseUs.advantages.map((advantage, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="mr-3 text-gold-500 text-lg">✓</span>
                                        <div>
                                            <h5 className="font-medium text-stone-800">{advantage.title}</h5>
                                            <span className="font-light text-sm text-stone-700">{advantage.description}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Final note */}
                        <div className="mt-8 text-center">
                            <p className="mx-auto max-w-3xl text-stone-600 font-light">
                                {pl.offerPage.weddingOffer.whyChooseUs.finalNote}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <Button
                            href={routes.contact.route}
                            variant="hero"
                            className="px-8 py-4"
                        >
                            {pl.contact.contactUs.checkAvailability}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Other Services Section */}
            <section className="w-full bg-section-background py-16 md:py-24 mt-16 px-4">
                <div className="mx-auto">
                    <SectionTitle
                        title={pl.offerPage.otherServices.title}
                        subtitle={pl.offerPage.otherServices.subtitle}
                    />

                    <div className="mx-auto max-w-4xl">
                        <div className="mb-12 text-center">
                            <p className="mx-auto max-w-3xl font-light leading-relaxed text-stone-600 mb-4">
                                {pl.offerPage.otherServices.description}
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2">
                            {pl.offerPage.otherServices.services.map((service, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="h-60 overflow-hidden">
                                        <img
                                            src={`https://images.unsplash.com/photo-${index === 0 ? '1607462109225-6b64ae2dd3cb' : '1611209009772-d40fd03d510d'}?q=80&w=600&h=400`}
                                            alt={service.imageAlt}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-serif text-xl font-medium text-stone-800 mb-2">{service.title}</h3>
                                        <p className="font-light text-stone-600">{service.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 flex justify-center">
                            <Button
                                href={routes.contact.route}
                                variant="default"
                            >
                                {pl.contact.formSections.contactInfo}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </PageContainer>
    );
}