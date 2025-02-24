import { getBlog, getBlogsList, getLastBlogs } from "./blog";

import { getVideosList } from "./video";

const empty = () => Promise.resolve({});

export const routes = {
    home: { fullPage: true, route: '/', getData: getLastBlogs },
    //pricing: { fullPage: false, route: '/cennik', getData: empty },
    offers: { fullPage: false, route: '/oferta', getData: empty },
    offer: { fullPage: false, route: '/oferta/:alias', getData: empty },
    // blogs: { fullPage: false, route: '/blog', getData: getBlogsList },
    blog: { fullPage: false, route: '/blog/:alias', getData: getBlog },
    contact: { fullPage: false, route: '/kontakt', getData: empty },
    videos: { fullPage: false, route: '/filmy', getData: getVideosList },
    links: { fullPage: false, route: '/linki', getData: empty },
    photos: {
        fullPage: false,
        route: '/blog/andrychow-zdjecia-film-fotografia-slubna-plener-reportaz-slubny',
        getData: () => getBlog('andrychow-zdjecia-film-fotografia-slubna-plener-reportaz-slubny'),
    },
    private: { fullPage: false, route: '/prywatna', getData: empty },
};
