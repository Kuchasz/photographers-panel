
import { strings } from "./resources";
import { zip } from "../../utils/array";
import { routes } from "./routes";

type MenuItem = { route: string; fullPage: boolean; label: string };
type MenuItems = keyof typeof strings.menu;
const mapToMenuItem = (v: { route: string; fullPage: boolean }, k: MenuItems): MenuItem => {
    return { route: v.route, fullPage: v.fullPage, label: strings.menu[k] };
};

export const menuItems = zip(Object.values(routes), Object.keys(routes) as MenuItems[], mapToMenuItem);