'use client';
import { first, last, nextElement } from "@pp/utils/dist/array";
import { firstSegment } from "@pp/utils/dist/url";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { type MenuItem, menuItems } from "~/menu-items";
import { Headers } from "./headers";
import { strings } from "../resources";
import { routes } from "~/routes";

const getSrc = (photo: string, ext: string) => `/images/top-new/${photo}${ext}`;

const selectedItem = (selectedPath: string, path: string) =>
    firstSegment(selectedPath) === path ? 'current' : undefined;

interface ImageCarouselProps {
    photos: string[];
    interval?: number;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ photos, interval = 5000 }) => {
    const [{ currentPhoto, prevPhoto }, setCurrentPhoto] = React.useState({
        prevPhoto: last(photos) as string,
        currentPhoto: first(photos) as string,
    });

    React.useEffect(() => {
        const timer = setTimeout(() => {
            const nextPhoto = nextElement(photos, currentPhoto) as string;
            setCurrentPhoto({ currentPhoto: nextPhoto, prevPhoto: currentPhoto });
        }, interval);

        return () => clearTimeout(timer);
    }, [currentPhoto, photos, interval]);

    return (
        <div className="relative w-full h-full">
            <picture key={prevPhoto} className="absolute contrast-85 inset-0 transition-all duration-[6000ms] ease-out scale-100">
                <source media="(min-width: 700px)" srcSet={getSrc(prevPhoto, '.jpg')} />
                {/* <source media="(max-width: 699px)" srcSet={getSrc(prevPhoto, '-600w.webp')} /> */}
                <img
                    alt={prevPhoto.split('-').join(' ')}
                    className="w-full h-full object-center object-cover"
                    src={getSrc(prevPhoto, '.jpg')} />
            </picture>
            <picture key={currentPhoto} className="absolute contrast-85 inset-0 animate-fade-and-zoom">
                <source media="(min-width: 700px)" srcSet={getSrc(currentPhoto, '.jpg')} />
                {/* <source media="(max-width: 699px)" srcSet={getSrc(currentPhoto, '-600w.webp')} /> */}
                <img
                    alt={currentPhoto.split('-').join(' ')}
                    className="w-full h-full object-center object-cover"
                    src={getSrc(currentPhoto, '.jpg')} />
            </picture>
            <div className="absolute inset-0 bg-black/20"></div>
            {/* <div className="absolute h-1/4 inset-0 bg-gradient-to-t from-transparent to-black"></div> */}
        </div>
    );
};

// Navigation component that can be used in both header variants
const Navigation = ({ isHomePage }: { isHomePage: boolean }) => {
    const pathname = usePathname();
    const textColorClass = isHomePage ? "text-white/90 hover:text-white" : "text-stone-800/90 hover:text-stone-800";
    const borderColorClass = isHomePage ? "border-white/80 hover:border-white" : "border-stone-800/80 hover:border-stone-800";
    const logoTextClass = isHomePage ? "text-white" : "text-stone-800";
    const logoSubtextClass = isHomePage ? "text-white/75" : "text-stone-800/75";

    return (
        <>
            <div className="hidden items-center gap-6 font-light tracking-wider transition-colors md:flex md:gap-8 lg:gap-12">
                <Link
                    href={routes.offers.route}
                    id={selectedItem(pathname, routes.offers.route)}
                    className={textColorClass}
                >
                    {strings.menu.offer}
                </Link>
                <Link
                    href={routes.photos.route}
                    id={selectedItem(pathname, routes.photos.route)}
                    className={textColorClass}
                >
                    {strings.menu.photos}
                </Link>
                <Link
                    href={routes.videos.route}
                    id={selectedItem(pathname, routes.videos.route)}
                    className={textColorClass}
                >
                    {strings.menu.videos}
                </Link>
            </div>

            <div className="flex flex-col items-center gap-1">
                <Link
                    href="/"
                    className="flex flex-col items-center gap-1 transition duration-300 hover:opacity-90"
                >
                    <div className={`text-2xl font-light leading-none md:text-3xl ${logoTextClass}`}>
                        <span className="tracking-wider">PYSZ</span>
                        <span className="font-medium tracking-wide">STUDIO</span>
                    </div>
                    <div className={`text-[10px] font-light leading-none tracking-[0.2em] md:text-xs ${logoSubtextClass}`}>
                        FOTOGRAFIA I FILM
                    </div>
                </Link>
            </div>

            <div className="hidden items-center gap-6 font-light tracking-wider transition-colors md:flex md:gap-8 lg:gap-12">
                <Link
                    href={routes.contact.route}
                    id={selectedItem(pathname, routes.contact.route)}
                    className={textColorClass}
                >
                    {strings.menu.contact}
                </Link>
                <Link
                    href={routes.private.route}
                    className={`border-b px-2 py-1 uppercase transition-colors ${borderColorClass} ${textColorClass}`}
                >
                    {strings.menu.private}
                </Link>
            </div>

            {/* Mobile menu items - shown on small screens */}
            <div className="flex w-full flex-col items-center gap-4 md:hidden">
                <div className="flex justify-center gap-6">
                    <Link 
                        href={routes.offers.route} 
                        id={selectedItem(pathname, routes.offers.route)}
                        className={textColorClass}
                    >
                        {strings.menu.offer}
                    </Link>
                    <Link 
                        href={routes.photos.route} 
                        id={selectedItem(pathname, routes.photos.route)}
                        className={textColorClass}
                    >
                        {strings.menu.photos}
                    </Link>
                    <Link 
                        href={routes.videos.route} 
                        id={selectedItem(pathname, routes.videos.route)}
                        className={textColorClass}
                    >
                        {strings.menu.videos}
                    </Link>
                </div>
                <div className="flex justify-center gap-6">
                    <Link 
                        href={routes.contact.route} 
                        id={selectedItem(pathname, routes.contact.route)}
                        className={textColorClass}
                    >
                        {strings.menu.contact}
                    </Link>
                    <Link
                        href={routes.private.route}
                        className={`border-b px-2 py-1 uppercase ${borderColorClass} ${textColorClass}`}
                    >
                        {strings.menu.private}
                    </Link>
                </div>
            </div>
        </>
    );
};

export const Header = () => {
    const pathname = usePathname();
    const [currentAdvantage, setCurrentAdvantage] = React.useState(strings.offer.slogan.advantages[0]);
    const isHomePage = pathname === '/';

    React.useEffect(() => {
        setTimeout(() => {
            const nextAdvantage = nextElement(strings.offer.slogan.advantages, currentAdvantage)! as string;
            setCurrentAdvantage(nextAdvantage);
        }, 5000);
    }, [currentAdvantage]);

    const firstItem = first(menuItems, (mi) => firstSegment(pathname) === mi.route) as MenuItem;

    // Home page header with hero image
    if (isHomePage) {
        return (
            <div>
                <Headers title={firstItem?.title}></Headers>

                <div className="relative flex flex-col items-center overflow-hidden h-screen">
                    <div className="-z-10 absolute h-full w-full">
                        <ImageCarousel photos={strings.main.topPhotos} />
                    </div>
                    <nav className="relative w-full border-b border-white/10 backdrop-blur-sm">
                        <div className="container mx-auto flex flex-col items-center gap-6 px-4 py-6 md:flex-row md:justify-between md:gap-8 md:py-8 lg:px-12">
                            <Navigation isHomePage={true} />
                        </div>
                    </nav>
                </div>
            </div>
        );
    }

    // Other pages header with white background
    return (
        <div>
            <Headers title={firstItem?.title}></Headers>
            <nav className="relative w-full border-b border-stone-100 bg-white">
                <div className="container mx-auto flex flex-col items-center gap-6 px-4 py-6 md:flex-row md:justify-between md:gap-8 md:py-8 lg:px-12">
                    <Navigation isHomePage={false} />
                </div>
            </nav>
        </div>
    );
};
