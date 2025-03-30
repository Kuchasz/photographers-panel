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
import { Button } from "./button";

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
    const [scrollY, setScrollY] = React.useState(0);

    // Track current photo for carousel
    React.useEffect(() => {
        const timer = setTimeout(() => {
            const nextPhoto = nextElement(photos, currentPhoto) as string;
            setCurrentPhoto({ currentPhoto: nextPhoto, prevPhoto: currentPhoto });
        }, interval);

        return () => clearTimeout(timer);
    }, [currentPhoto, photos, interval]);

    // Track scroll position for parallax effect
    React.useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Get initial scroll position
        handleScroll();

        // Clean up
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Calculate parallax transform (subtle movement)
    const parallaxTransform = `translateY(${scrollY * 0.35}px)`;

    return (
        <div className="relative w-full h-full overflow-hidden">
            <picture 
                key={prevPhoto} 
                className="absolute contrast-85 inset-0"
                style={{ transform: parallaxTransform }}>
                <source media="(min-width: 700px)" srcSet={getSrc(prevPhoto, '.jpg')} />
                {/* <source media="(max-width: 699px)" srcSet={getSrc(prevPhoto, '-600w.webp')} /> */}
                <img
                    alt={prevPhoto.split('-').join(' ')}
                    className="w-full h-full object-center object-cover"
                    src={getSrc(prevPhoto, '.jpg')} />
            </picture>
            <picture 
                key={currentPhoto} 
                className="absolute contrast-85 inset-0 animate-fade"
                style={{ transform: parallaxTransform }}>
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
    const textColorClass = isHomePage ? "transition-colors text-white/90 hover:text-gold-500" : "transition-colors text-stone-800/90 hover:text-gold-700";
    const borderColorClass = isHomePage ? "border-white/80 hover:border-gold-500" : "border-stone-800/80 hover:border-gold-700";
    const logoTextClass = isHomePage ? "text-white" : "text-stone-800";
    const logoSubtextClass = isHomePage ? "text-white/75" : "text-stone-800/75";

    return (
        <>
            <div className="hidden items-center gap-6 font-normal tracking-wider transition-colors md:flex md:gap-8 lg:gap-12">
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

            <div className="hidden items-center gap-6 font-normal tracking-wider transition-colors md:flex md:gap-8 lg:gap-12">
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
                    <nav className="relative w-full border-b border-white/10 backdrop-blur-sm z-20">
                        <div className="container mx-auto flex flex-col items-center gap-6 px-4 py-6 md:flex-row md:justify-between md:gap-8 md:py-8 lg:px-12">
                            <Navigation isHomePage={true} />
                        </div>
                    </nav>

                    {/* Hero text overlay */}
                    <div className="absolute inset-0 flex items-end z-10 pointer-events-none">
                        <div className="w-full bg-gradient-to-t from-black/60 to-transparent pb-36 pt-24">
                            <div className="mx-auto max-w-6xl px-4 text-center">
                                <h1 className="font-serif text-white">
                                    <div className="mb-6 flex flex-col items-center md:mb-8">
                                        <div className="flex flex-col md:flex-row md:items-baseline md:justify-center md:gap-3">
                                            <span className="text-3xl italic font-light md:text-4xl lg:text-5xl">{strings.main.hero.embrace}</span>
                                            <span className="text-4xl font-normal md:text-5xl lg:text-6xl">{strings.main.hero.timeless}</span>
                                        </div>
                                        <div className="mt-3 flex flex-col md:flex-row md:items-baseline md:justify-center md:gap-3">
                                            <span className="text-4xl font-normal md:text-5xl lg:text-6xl">{strings.main.hero.celebrating}</span>
                                            <span className="text-3xl italic font-light md:text-4xl lg:text-5xl">{strings.main.hero.through}</span>
                                        </div>
                                    </div>
                                </h1>
                                <div className="mt-8 pointer-events-auto">
                                    <Button
                                        href="kontakt"
                                        variant="hero"
                                    >
                                        {strings.main.hero.pricing}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
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
