import { routes } from "~/routes";
import { strings } from "./resources";
import { zip } from "~/utils/array";

export type MenuItem = {
    route: string;
    fullPage: boolean;
    label: string;
    title: string;
};
type MenuItems = keyof typeof strings.menu;
const mapToMenuItem = (v: { route: string; fullPage: boolean }, k: MenuItems): MenuItem => {
    return {
        route: v.route,
        fullPage: v.fullPage,
        label: strings.menu[k],
        title: strings.pageTitles[k],
    };
};

export const menuItems = zip(Object.values(routes), Object.keys(routes) as MenuItems[], mapToMenuItem);
