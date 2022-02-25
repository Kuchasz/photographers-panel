import { getBlog, getBlogsList, getLastBlogs } from './blog';
import { getVideosList } from './video';
import { getOffersList, getOffer } from './offer';

const empty = () => Promise.resolve({});

export const routes = {
    home: { fullPage: true, route: '/', getData: getLastBlogs },
    pricing: { fullPage: false, route: '/cennik', getData: empty },
    offers: { fullPage: false, route: '/oferta', getData: getOffersList },
    offer: { fullPage: false, route: '/oferta/:alias', getData: getOffer },
    blogs: { fullPage: false, route: '/blog', getData: getBlogsList },
    blog: { fullPage: false, route: '/blog/:alias', getData: getBlog },
    contact: { fullPage: false, route: '/kontakt', getData: empty },
    videos: { fullPage: false, route: '/filmy', getData: getVideosList },
    links: { fullPage: false, route: '/linki', getData: empty },
    private: { fullPage: false, route: '/prywatna', getData: empty },
};
