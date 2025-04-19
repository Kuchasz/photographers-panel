'use client';
import { first, last, nextElement } from "~/lib/array";
import { firstSegment } from "~/lib/url";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { type MenuItem, menuItems } from "~/menu-items";
import { Headers } from "./headers";
import { strings } from "../resources";
import { routes } from "~/routes";
import { Button } from "./button";

const getSrc = (photo: string, ext: string) => `/images/top/${photo}${ext}`;

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

// Enhanced navigation link component for consistent styling
const NavLink = ({
    href,
    isActive,
    isHomePage,
    isPrimary = false,
    children,
    onClick
}: {
    href: string;
    isActive: boolean;
    isHomePage: boolean;
    isPrimary?: boolean;
    children: string | string[];
    onClick?: () => void;
}) => {
    const baseTextClass = isHomePage
        ? "text-white/90 hover:text-gold-500"
        : "text-stone-800/90 hover:text-gold-700";

    const activeBorderClass = isHomePage
        ? "after:bg-gold-500"
        : "after:bg-gold-700";

    const primaryClass = isPrimary
        ? `border ${isHomePage ? "border-gold-500 text-gold-500 hover:bg-gold-500/10" : "border-gold-700 text-gold-700 hover:bg-gold-700/10"} px-3 py-1.5 rounded-sm`
        : "";

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`
                relative font-normal tracking-wider transition-all duration-300 flex items-center
                ${baseTextClass}
                ${primaryClass}
                ${isActive && !isPrimary ? `font-medium ${activeBorderClass} after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-100` : "after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out"}
            `}
        >
            {children}
        </Link>
    );
};

// Navigation component that can be used in both header variants
const Navigation = ({ 
    isHomePage, 
    toggleMobileMenu 
}: { 
    isHomePage: boolean; 
    toggleMobileMenu: () => void;
}) => {
    const pathname = usePathname();

    const logoTextClass = isHomePage ? "text-white" : "text-stone-800";
    const logoSubtextClass = isHomePage ? "text-white/75" : "text-stone-800/75";

    return (
        <>
            {/* Desktop navigation */}
            <div className="hidden items-center gap-6 font-normal tracking-wider md:flex md:gap-8 lg:gap-12">
                <NavLink
                    href={routes.offers.route}
                    isActive={firstSegment(pathname) === routes.offers.route}
                    isHomePage={isHomePage}
                >
                    {strings.menu.offer}
                </NavLink>
                <NavLink
                    href={routes.photos.route}
                    isActive={firstSegment(pathname) === routes.photos.route}
                    isHomePage={isHomePage}
                >
                    {strings.menu.photos}
                </NavLink>
                <NavLink
                    href={routes.videos.route}
                    isActive={firstSegment(pathname) === routes.videos.route}
                    isHomePage={isHomePage}
                >
                    {strings.menu.videos}
                </NavLink>
            </div>

            {/* Logo */}
            <div className="flex flex-col items-center gap-1">
                <Link
                    href="/"
                    className="flex flex-col items-center gap-1 transition duration-300 hover:opacity-90"
                    aria-label="Home"
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

            {/* Desktop right navigation */}
            <div className="hidden items-center gap-6 font-normal tracking-wider md:flex md:gap-8 lg:gap-12">
                <NavLink
                    href={routes.contact.route}
                    isActive={firstSegment(pathname) === routes.contact.route}
                    isHomePage={isHomePage}
                >
                    {strings.menu.contact}
                </NavLink>
                <NavLink
                    href={routes.private.route}
                    isActive={false}
                    isHomePage={isHomePage}
                    isPrimary={true}
                >
                    {strings.menu.private}
                </NavLink>
            </div>

            {/* Mobile menu button */}
            <button
                className="absolute right-4 top-6 z-[60] flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full md:hidden cursor-pointer transition-colors duration-200 hover:bg-black/10"
                onClick={toggleMobileMenu}
                aria-label="Open menu"
                aria-expanded="false"
            >
                <span
                    className={`h-0.5 w-6 transform transition-all duration-300 ease-in-out ${isHomePage ? 'bg-white' : 'bg-stone-800'}`}
                ></span>
                <span
                    className={`h-0.5 w-6 transition-all duration-300 ease-in-out ${isHomePage ? 'bg-white' : 'bg-stone-800'}`}
                ></span>
                <span
                    className={`h-0.5 w-6 transform transition-all duration-300 ease-in-out ${isHomePage ? 'bg-white' : 'bg-stone-800'}`}
                ></span>
            </button>
        </>
    );
};

// Mobile menu component with slide-in animation
const MobileMenu = ({ isOpen, onClose, isHomePage }: { 
    isOpen: boolean; 
    onClose: () => void; 
    isHomePage: boolean;
}) => {
    return (
        <div 
            className={`fixed inset-0 z-[200] md:hidden ${isOpen ? 'visible' : 'invisible'}`}
            style={{ 
                transitionProperty: 'visibility', 
                transitionDuration: isOpen ? '0ms' : '500ms', 
                transitionDelay: isOpen ? '0ms' : '0ms' 
            }}
        >
            {/* Overlay background */}
            <div 
                className={`absolute inset-0 bg-black/70 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                style={{ 
                    transitionProperty: 'opacity', 
                    transitionDuration: '300ms',
                    transitionTimingFunction: 'ease-in-out'
                }}
                onClick={onClose}
            ></div>
            
            {/* Slide-in panel */}
            <div 
                className={`absolute right-0 top-0 h-full w-4/5 max-w-xs overflow-y-auto ${isHomePage ? 'bg-black/90 backdrop-blur-lg' : 'bg-white/95 backdrop-blur-md shadow-md'}`}
                style={{ 
                    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                    transitionProperty: 'transform', 
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', 
                    transitionDuration: '300ms',
                    willChange: 'transform'
                }}
            >
                {/* Close button */}
                <button 
                    className="absolute right-4 top-4 rounded-full p-2 transition-colors duration-200 hover:bg-black/10 cursor-pointer"
                    onClick={onClose}
                    aria-label="Close menu"
                >
                    <svg className={`h-6 w-6 ${isHomePage ? 'text-white' : 'text-stone-800'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                {/* Logo */}
                <div className="mt-14 mb-8 flex justify-center">
                    <Link
                        href="/"
                        className="flex flex-col items-center gap-1 transition duration-300 hover:opacity-90"
                        aria-label="Home"
                        onClick={onClose}
                    >
                        <div className={`text-2xl font-light leading-none ${isHomePage ? 'text-white' : 'text-stone-800'}`}>
                            <span className="tracking-wider">PYSZ</span>
                            <span className="font-medium tracking-wide">STUDIO</span>
                        </div>
                        <div className={`text-[10px] font-light leading-none tracking-[0.2em] ${isHomePage ? 'text-white/75' : 'text-stone-800/75'}`}>
                            FOTOGRAFIA I FILM
                        </div>
                    </Link>
                </div>
                
                {/* Divider */}
                <div className={`mx-6 h-px ${isHomePage ? 'bg-white/20' : 'bg-stone-800/10'}`}></div>
                
                {/* Menu items */}
                <div className="flex flex-col items-center gap-7 px-6 py-8 text-lg">
                    <NavLink
                        href={routes.offers.route}
                        isActive={firstSegment(usePathname()) === routes.offers.route}
                        isHomePage={isHomePage}
                        onClick={onClose}
                    >
                        {strings.menu.offer}
                    </NavLink>
                    <NavLink
                        href={routes.photos.route}
                        isActive={firstSegment(usePathname()) === routes.photos.route}
                        isHomePage={isHomePage}
                        onClick={onClose}
                    >
                        {strings.menu.photos}
                    </NavLink>
                    <NavLink
                        href={routes.videos.route}
                        isActive={firstSegment(usePathname()) === routes.videos.route}
                        isHomePage={isHomePage}
                        onClick={onClose}
                    >
                        {strings.menu.videos}
                    </NavLink>
                    <NavLink
                        href={routes.contact.route}
                        isActive={firstSegment(usePathname()) === routes.contact.route}
                        isHomePage={isHomePage}
                        onClick={onClose}
                    >
                        {strings.menu.contact}
                    </NavLink>
                    
                    {/* Divider before special button */}
                    <div className={`w-16 h-px my-2 ${isHomePage ? 'bg-white/20' : 'bg-stone-800/10'}`}></div>
                    
                    <NavLink
                        href={routes.private.route}
                        isActive={false}
                        isHomePage={isHomePage}
                        isPrimary={true}
                        onClick={onClose}
                    >
                        {strings.menu.private}
                    </NavLink>
                </div>
                
                {/* Footer */}
                <div className={`absolute bottom-8 left-0 right-0 text-center text-sm ${isHomePage ? 'text-white/60' : 'text-stone-600'}`}>
                    © {new Date().getFullYear()} PYSZSTUDIO
                </div>
            </div>
        </div>
    );
};

export const Header = () => {
    const pathname = usePathname();
    const [currentAdvantage, setCurrentAdvantage] = React.useState(strings.offer.slogan.advantages[0]);
    const isHomePage = pathname === '/';
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const toggleMobileMenu = React.useCallback(() => {
        setIsMobileMenuOpen(prev => !prev);
    }, []);

    React.useEffect(() => {
        setTimeout(() => {
            const nextAdvantage = nextElement(strings.offer.slogan.advantages, currentAdvantage)! as string;
            setCurrentAdvantage(nextAdvantage);
        }, 5000);
    }, [currentAdvantage]);

    // Add scroll detection for dynamic header appearance
    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Check initial scroll position

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Prevent scroll when mobile menu is open
    React.useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMobileMenuOpen]);

    // Close menu on route change
    React.useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const firstItem = first(menuItems, (mi) => firstSegment(pathname) === mi.route) as MenuItem;

    // Home page header with hero image
    if (isHomePage) {
        return (
            <div className="relative">
                <Headers title={firstItem?.title}></Headers>

                <div className="relative flex flex-col items-center overflow-hidden h-screen">
                    <div className="-z-10 absolute h-full w-full">
                        <ImageCarousel photos={strings.main.topPhotos} />
                    </div>
                    <nav className={`fixed top-0 left-0 right-0 w-full z-50 border-b transition-all duration-300 ${isScrolled ? 'bg-black/60 backdrop-blur-md shadow-md border-transparent' : 'border-white/10 backdrop-blur-sm'}`}>
                        <div className="container mx-auto flex flex-col items-center gap-6 px-4 py-6 md:flex-row md:justify-between md:gap-8 md:py-6 lg:px-12">
                            <Navigation isHomePage={true} toggleMobileMenu={toggleMobileMenu} />
                        </div>
                    </nav>

                    {/* Mobile Menu */}
                    <MobileMenu 
                        isOpen={isMobileMenuOpen} 
                        onClose={() => setIsMobileMenuOpen(false)} 
                        isHomePage={true}
                    />

                    {/* Hero text overlay */}
                    <div className="absolute inset-0 flex items-end z-10 pointer-events-none">
                        <div className="w-full bg-gradient-to-t from-black/60 to-transparent pb-36 pt-24">
                            <div className="mx-auto max-w-6xl px-4 text-center">
                                <h1 className="font-serif text-white">
                                    <div className="mb-6 flex flex-col items-center md:mb-8">
                                        <div className="flex flex-col md:flex-row md:items-baseline md:justify-center md:gap-3">
                                            <span className="text-3xl italic font-light md:text-4xl lg:text-5xl animate-fadeIn">{strings.main.hero.embrace}</span>
                                            <span className="text-4xl font-normal md:text-5xl lg:text-6xl animate-fadeIn animation-delay-200">{strings.main.hero.timeless}</span>
                                        </div>
                                        <div className="mt-3 flex flex-col md:flex-row md:items-baseline md:justify-center md:gap-3">
                                            <span className="text-4xl font-normal md:text-5xl lg:text-6xl animate-fadeIn animation-delay-400">{strings.main.hero.celebrating}</span>
                                            <span className="text-3xl italic font-light md:text-4xl lg:text-5xl animate-fadeIn animation-delay-600">{strings.main.hero.through}</span>
                                        </div>
                                    </div>
                                </h1>
                                <div className="mt-8 pointer-events-auto animate-fadeIn animation-delay-800">
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
            {/* Add a spacer div that matches the header height */}
            <div className="h-[88px]"></div>
            <div className="fixed top-0 left-0 right-0 w-full z-50">
                <Headers title={firstItem?.title}></Headers>
                <nav className={`w-full transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-md backdrop-blur-md border-b border-transparent' : 'border-b border-stone-100 bg-white'}`}>
                    <div className="container mx-auto flex flex-col items-center gap-6 px-4 py-6 md:flex-row md:justify-between md:gap-8 md:py-6 lg:px-12">
                        <Navigation isHomePage={false} toggleMobileMenu={toggleMobileMenu} />
                    </div>
                </nav>
            </div>
            
            {/* Mobile Menu */}
            <MobileMenu 
                isOpen={isMobileMenuOpen} 
                onClose={() => setIsMobileMenuOpen(false)} 
                isHomePage={false}
            />
        </div>
    );
};
