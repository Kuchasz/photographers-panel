import { strings } from "./resources";
import { zip } from "../../utils/array";

export const routes = {
    home: { fullPage: true, route: '/', label: 'Home'},
    offer: { fullPage: false, route: '/oferta', label: 'Offer'},
    blog: { fullPage: false, route: '/blog', label: 'Blog'},
    contact: { fullPage: false, route: '/kontakt', label: 'Contact'},
    gallery: { fullPage: false, route: '/galeria', label: 'Gallery'},
    movies: { fullPage: false, route: '/filmy', label: 'Movies'},
    links: { fullPage: false, route: '/linki', label: 'Links'},
    private: { fullPage: false, route: '/prywatna', label: 'Private'}
};

type MenuItem = { route: string, fullPage: boolean, label: string };
type MenuItems = keyof typeof strings.menu;
const mapToMenuItem = (v: { route: string, fullPage: boolean }, k: MenuItems): MenuItem => {
    return ({ route: v.route, fullPage: v.fullPage, label: strings.menu[k] });
}

export const menuItems = zip(Object.values(routes), Object.keys(routes) as MenuItems[], mapToMenuItem);
