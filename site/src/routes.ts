import { strings } from "./resources";
import { zip } from "../../utils/array";
import { getBlog, getBlogsList, getLastBlog } from "../../api/blog";
import { getOffersList, getOffer } from "../../api/offer";
import { getVideosList } from "../../api/video";

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

type MenuItem = { route: string; fullPage: boolean; label: string };
type MenuItems = keyof typeof strings.menu;
const mapToMenuItem = (v: { route: string; fullPage: boolean }, k: MenuItems): MenuItem => {
    return { route: v.route, fullPage: v.fullPage, label: strings.menu[k] };
};


export const menuItems = zip(Object.values(routes), Object.keys(routes) as MenuItems[], mapToMenuItem);
