export const routes = {
    home: { fullPage: true, route: '/' },
    offers: { fullPage: false, route: '/oferta' },
    offer: { fullPage: false, route: '/oferta/:alias' },
    blog: { fullPage: false, route: '/blog/:alias' },
    contact: { fullPage: false, route: '/kontakt' },
    videos: { fullPage: false, route: '/filmy' },
    links: { fullPage: false, route: '/linki' },
    photos: {
        fullPage: false,
        route: '/zdjecia',
    },
    private: { fullPage: false, route: '/prywatna' },
};
