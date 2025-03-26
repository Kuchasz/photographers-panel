import React from "react";
import { getYear } from "@pp/utils/dist/date";
import { strings } from "~/resources";
// import { menuItems } from "../menuItems";

const year: number = getYear(new Date());

export const Footer = () => (
    <footer className="border-t border-stone-100 bg-white py-12">
        <section className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
                <div className="space-y-4">
                    <h1 className="font-serif text-lg font-light tracking-wide text-stone-800">
                        © {year} {strings.footer.copyrights}
                    </h1>
                    <ul className="flex flex-wrap justify-center gap-4 text-sm font-light text-stone-600 md:justify-start">
                        {/* {menuItems.map((mi, index) => (
                            <li key={mi.route} className="hover:text-stone-400">
                                <Link to={mi.route}>{mi.label}</Link>
                                {index < menuItems.length - 1 ? ' / ' : undefined}
                            </li>
                        ))} */}
                    </ul>
                </div>
                <div className="space-y-4">
                    <h1 className="font-serif text-lg font-light tracking-wide text-stone-800">
                        {strings.footer.socialMedia.header}
                    </h1>
                    <ul className="flex flex-wrap justify-center gap-4 text-sm font-light md:justify-start">
                        <li>
                            <a
                                href={strings.footer.socialMedia.url.facebook}
                                rel="noopener"
                                target="_blank"
                                className="text-stone-600 transition duration-200 hover:text-stone-400"
                            >
                                {strings.footer.socialMedia.facebook}
                            </a>
                        </li>
                        <li className="text-stone-400">/</li>
                        <li>
                            <a
                                href={strings.footer.socialMedia.url.youtube}
                                rel="noopener"
                                target="_blank"
                                className="text-stone-600 transition duration-200 hover:text-stone-400"
                            >
                                {strings.footer.socialMedia.youtube}
                            </a>
                        </li> 
                        <li className="text-stone-400">/</li>
                        <li>
                            <a
                                href={strings.footer.socialMedia.url.instagram}
                                rel="noopener"
                                target="_blank"
                                className="text-stone-600 transition duration-200 hover:text-stone-400"
                            >
                                {strings.footer.socialMedia.instagram}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    </footer>
);
