'use client';
import { routes } from "@pp/api/dist/site/routes";
import { first, last, nextElement } from "@pp/utils/dist/array";
import { firstSegment } from "@pp/utils/dist/url";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { menuItems } from "~/menu-items";
import { Headers } from "../components/headers";
import { strings } from "../resources";

const getSrc = (photo: string, ext: string) => `/images/top/${photo}${ext}`;

const selectedItem = (selectedPath: string, path: string) =>
    firstSegment(selectedPath) === path ? 'current' : undefined;

interface ImageCarouselProps {
    photos: string[];
    interval?: number;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ photos, interval = 5000 }) => {
    const [{ currentPhoto, prevPhoto }, setCurrentPhoto] = React.useState({
        prevPhoto: last(photos),
        currentPhoto: first(photos),
    });

    React.useEffect(() => {
        const timer = setTimeout(() => {
            const nextPhoto = nextElement(photos, currentPhoto);
            setCurrentPhoto({ currentPhoto: nextPhoto, prevPhoto: currentPhoto });
        }, interval);

        return () => clearTimeout(timer);
    }, [currentPhoto, photos, interval]);

    return (
        <div className="relative w-full h-96">
            <picture key={prevPhoto + '-p'} className="absolute inset-0 transition-opacity duration-1000 ease-out">
                <source media="(min-width: 700px)" srcSet={getSrc(prevPhoto, '.webp')} />
                <source media="(max-width: 699px)" srcSet={getSrc(prevPhoto, '-600w.webp')} />
                <img
                    alt={prevPhoto.split('-').join(' ')}
                    className="w-full h-full object-cover"
                    src={getSrc(prevPhoto, '.webp')} />
            </picture>
            <picture key={currentPhoto + '-c'} className="absolute inset-0 transition-opacity duration-1000 ease-out opacity-0 animate-fade-in">
                <source media="(min-width: 700px)" srcSet={getSrc(currentPhoto, '.webp')} />
                <source media="(max-width: 699px)" srcSet={getSrc(currentPhoto, '-600w.webp')} />
                <img
                    alt={currentPhoto.split('-').join(' ')}
                    className="w-full h-full object-cover"
                    src={getSrc(currentPhoto, '.webp')} />
            </picture>
        </div>
    );
};

export const Header = () => {
    const pathname = usePathname();
    const [currentAdvantage, setCurrentAdvantage] = React.useState(strings.offer.slogan.advantages[0]);

    React.useEffect(() => {
        setTimeout(() => {
            const nextAdvantage = nextElement(strings.offer.slogan.advantages, currentAdvantage);
            setCurrentAdvantage(nextAdvantage);
        }, 5000);
    }, [currentAdvantage]);

    const firstItem = first(menuItems, (mi) => firstSegment(pathname) === mi.route);

    return (
        <>
            <Headers title={firstItem?.title}></Headers>
            <header>
                <ImageCarousel photos={strings.main.topPhotos} />
                <span>
                    {strings.offer.slogan.advantages.map((adv) => (
                        <span key={adv} className={`transition-all duration-500 ease-out ${adv === currentAdvantage ? 'opacity-100 scale-105' : 'opacity-0'}`}>
                            {adv}
                        </span>
                    ))}
                </span>
                <div>
                    <nav>
                        <Link href={routes.home.route} id={selectedItem(pathname, routes.home.route)}>
                            {strings.menu.home}
                        </Link>
                        {/*
                        <Link
                            href={routes.pricing.route}
                            id={selectedItem(pathname, routes.pricing.route)}>
                            {strings.menu.pricing}
                        </Link> 
                        */}
                        <Link href={routes.offers.route} id={selectedItem(pathname, routes.offers.route)}>
                            {strings.menu.offer}
                        </Link>
                        {/* <Link href={routes.blogs.route} id={selectedItem(pathname, routes.blogs.route)}>
                            {strings.menu.blog}
                        </Link> */}
                        <Link href={routes.photos.route} id={selectedItem(pathname, routes.photos.route)}>
                            {strings.menu.photos}
                        </Link>
                        <Link href={routes.videos.route} id={selectedItem(pathname, routes.videos.route)}>
                            {strings.menu.videos}
                        </Link>
                        <Link
                            href={routes.contact.route}
                            id={selectedItem(pathname, routes.contact.route)}>
                            {strings.menu.contact}
                        </Link>
                        <Link id="gallery" href={routes.private.route}>
                            {strings.menu.private}
                        </Link>
                    </nav>
                </div>
                <div>
                    <div>
                        <span>PYSZ</span>
                        <span>STUDIO</span>
                    </div>
                    <div>FOTOGRAFIA I FILM</div>
                </div>
            </header>
        </>
    );
};
