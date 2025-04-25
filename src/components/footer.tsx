import React from "react";
import { getYear } from "~/lib/date";
import { strings } from "~/resources";
import Link from "next/link";
import { routes } from "~/routes";
import { InstagramGrid } from "./instagram-grid";
import { getInstagramPostsForFooter } from "~/collections/instagram/actions";
import { SectionTitle } from "./section-title";

const year: number = getYear(new Date());

export const dynamic = 'force-dynamic';

export async function Footer() {
    // Fetch Instagram posts for the footer
    const instagramPosts = await getInstagramPostsForFooter();

    return (<footer className="bg-white pb-8 md:pb-16">
        {/* Instagram Section */}
        <section className="w-full bg-section-background py-12 md:py-24">
            <div className="container mx-auto px-4">
                <SectionTitle
                    title={strings.instagram.title}
                    subtitle={strings.instagram.subtitle}
                />

                <div className="mx-auto max-w-5xl">
                    <InstagramGrid posts={instagramPosts} maxPosts={6} />
                </div>
            </div>
        </section>

        <section className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-10 my-12 md:my-24 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                {/* Company Info */}
                <div className="flex flex-col items-center md:items-start">
                    <Link
                        href="/"
                        className="flex flex-col items-center md:items-start gap-1 transition duration-300 hover:opacity-90"
                    >
                        <div className={`text-2xl font-light leading-none md:text-3xl text-stone-800`}>
                            <span className="tracking-wider">PYSZ</span>
                            <span className="font-medium tracking-wide">STUDIO</span>
                        </div>
                        <div className={`text-[10px] font-light leading-none tracking-[0.2em] md:text-xs text-stone-800`}>
                            FOTOGRAFIA I FILM
                        </div>
                    </Link>

                    {/* Social Media Links - Now under logo */}
                    <div className="flex space-x-4 mt-5">
                        <a
                            href={strings.footer.socialMedia.url.facebook}
                            rel="noopener"
                            target="_blank"
                            aria-label={strings.contact.socialLinks.facebook}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-100 text-gold-600 transition duration-200 hover:bg-gold-500 hover:text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                            </svg>
                        </a>
                        <a
                            href={strings.footer.socialMedia.url.instagram}
                            rel="noopener"
                            target="_blank"
                            aria-label={strings.contact.socialLinks.instagram}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-100 text-gold-600 transition duration-200 hover:bg-gold-500 hover:text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>
                        <a
                            href={strings.footer.socialMedia.url.youtube}
                            rel="noopener"
                            target="_blank"
                            aria-label={strings.contact.socialLinks.youtube}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-100 text-gold-600 transition duration-200 hover:bg-gold-500 hover:text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="mt-8 md:mt-0 flex flex-col items-center md:items-start">
                    <span className="text-lg font-medium text-stone-800 mb-4 text-center md:text-left">{strings.footer.quickLinks}</span>
                    <ul className="space-y-3 font-light flex flex-col items-center md:items-start">
                        <li>
                            <Link href="/" className="text-stone-600 hover:text-gold-500 transition duration-200">
                                {strings.menu.home}
                            </Link>
                        </li>
                        <li>
                            <Link href={routes.offers.route} className="text-stone-600 hover:text-gold-500 transition duration-200">
                                {strings.menu.offer}
                            </Link>
                        </li>
                        <li>
                            <Link href={routes.photos.route} className="text-stone-600 hover:text-gold-500 transition duration-200">
                                {strings.menu.photos}
                            </Link>
                        </li>
                        <li>
                            <Link href={routes.videos.route} className="text-stone-600 hover:text-gold-500 transition duration-200">
                                {strings.menu.videos}
                            </Link>
                        </li>
                        <li>
                            <Link href={routes.contact.route} className="text-stone-600 hover:text-gold-500 transition duration-200">
                                {strings.menu.contact}
                            </Link>
                        </li>
                        <li>
                            <Link href={routes.private.route} className="text-stone-600 hover:text-gold-500 transition duration-200">
                                {strings.menu.private}
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="mt-8 lg:mt-0 flex flex-col items-center md:items-start">
                    <span className="text-lg font-medium text-stone-800 mb-4 text-center md:text-left">{strings.footer.contact}</span>
                    <ul className="space-y-4 font-light flex flex-col items-center md:items-start">
                        <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 mr-3 text-gold-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <a href={`mailto:${strings.contact.email}`} className="text-stone-600 hover:text-gold-500 transition duration-200">
                                {strings.contact.email}
                            </a>
                        </li>
                        <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 mr-3 text-gold-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <a href={`tel:+48${strings.contact.phone}`} className="text-stone-600 hover:text-gold-500 transition duration-200">
                                {strings.contact.phone}
                            </a>
                        </li>
                        <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 mr-3 text-gold-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <a
                                href={`https://maps.app.goo.gl/h4Zzi48yAHENtW9w7`}
                                target="_blank"
                                rel="noopener"
                                className="text-stone-600 hover:text-gold-500 transition duration-200"
                            >
                                {strings.contact.address.map((line, index) => (
                                    <div key={index}>{line}</div>
                                ))}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar with Links */}
            <div className="mt-8 md:mt-12 border-t border-stone-200 pt-6 md:pt-8">
                <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                    <p className="text-xs text-stone-500">
                        © {year} {strings.footer.copyrights}
                    </p>
                    {/* <div className="flex space-x-6">
                        <Link href="/privacy-policy" className="text-xs text-stone-500 hover:text-gold-500 transition duration-200">
                            {strings.footer.privacyPolicy}
                        </Link>
                        <Link href="/terms" className="text-xs text-stone-500 hover:text-gold-500 transition duration-200">
                            {strings.footer.termsOfService}
                        </Link>
                    </div> */}
                </div>
            </div>
        </section>
    </footer>
    );
}
