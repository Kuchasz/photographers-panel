import { getBlog, getBlogsList, getLastBlog } from "@pp/api/site/blog";
import { getVideosList } from "@pp/api/site/video";
import { getOffersList, getOffer } from "@pp/api/site/offer";

const empty = () => Promise.resolve({});

export const routes = {
    home: { fullPage: true, route: "/", label: "Home", getData: getLastBlog },
    offers: { fullPage: false, route: "/oferta", label: "Offer", getData: getOffersList },
    offer: { fullPage: false, route: "/oferta/:alias", label: "Offer", getData: getOffer },
    blogs: { fullPage: false, route: "/blog", label: "Blog", getData: getBlogsList },
    blog: { fullPage: false, route: "/blog/:alias", label: "Blog", getData: getBlog },
    contact: { fullPage: false, route: "/kontakt", label: "Contact", getData: empty },
    videos: { fullPage: false, route: "/filmy", label: "Videos", getData: getVideosList },
    links: { fullPage: false, route: "/linki", label: "Links", getData: empty },
    private: { fullPage: false, route: "/prywatna", label: "Private", getData: empty }
};
