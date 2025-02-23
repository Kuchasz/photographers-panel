'use client';
import { routes } from "@pp/api/dist/site/routes";
import { first, last, nextElement } from "@pp/utils/dist/array";
import { firstSegment } from "@pp/utils/dist/url";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { type MenuItem, menuItems } from "~/menu-items";
import { Headers } from "../components/headers";
import { strings } from "../resources";

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

export const Header = () => {
    const pathname = usePathname();
    const [currentAdvantage, setCurrentAdvantage] = React.useState(strings.offer.slogan.advantages[0]);

    React.useEffect(() => {
        setTimeout(() => {
            const nextAdvantage = nextElement(strings.offer.slogan.advantages, currentAdvantage) as string;
            setCurrentAdvantage(nextAdvantage);
        }, 5000);
    }, [currentAdvantage]);

    const firstItem = first(menuItems, (mi) => firstSegment(pathname) === mi.route) as MenuItem;

    return (
        <div>
            <Headers title={firstItem?.title}></Headers>

            <div className="relative flex flex-col items-center overflow-hidden h-screen">
                <div className="-z-10 absolute h-full w-full">
                    <ImageCarousel photos={strings.main.topPhotos} />
                </div>
                <nav className="border-b-2 border-white text-white max-w-7xl uppercase px-12 py-8 flex items-center justify-between w-full">
                    <div className="flex items-center gap-12 font-light tracking-wider">
                        <Link href={routes.offers.route} id={selectedItem(pathname, routes.offers.route)}>
                            {strings.menu.offer}
                        </Link>
                        <Link href={routes.photos.route} id={selectedItem(pathname, routes.photos.route)}>
                            {strings.menu.photos}
                        </Link>
                        <Link href={routes.videos.route} id={selectedItem(pathname, routes.videos.route)}>
                            {strings.menu.videos}
                        </Link>
                    </div>
                    <div className="leading-none flex flex-col gap-1 items-center">
                        <div className="text-3xl leading-none font-light">
                            <span>PYSZ</span>
                            <span className="font-semibold">STUDIO</span>
                        </div>
                        <div className="text-xs leading-none tracking-widest opacity-75">FOTOGRAFIA I FILM</div>
                    </div>
                    <div className="flex items-center gap-12 font-light tracking-wider">
                        <Link
                            href={routes.contact.route}
                            id={selectedItem(pathname, routes.contact.route)}>
                            {strings.menu.contact}
                        </Link>
                        <Link className="uppercase border-b-2 px-2 py-1 border-white" href={routes.private.route}>
                            {strings.menu.private}
                        </Link>
                    </div>

                </nav>
                <span className="text-5xl text-white font-extralight relative w-full h-full">
                    {strings.offer.slogan.advantages.map((adv) => (
                        <span key={adv} className={`absolute w-full h-full flex items-center justify-center transition-all duration-2500 ease-out ${adv === currentAdvantage ? 'opacity-100 scale-105' : 'opacity-0'}`}>
                            {adv}
                        </span>
                    ))}
                </span>
            </div>
        </div>
    );
};
