import { strings } from './resources';
import { zip } from '@pp/utils/array';
import { routes } from '@pp/api/site/routes';

type MenuItem = {
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

// console.log(zip(Object.values(routes), Object.keys(routes) as MenuItems[], mapToMenuItem));
export const menuItems = zip(Object.values(routes), Object.keys(routes) as MenuItems[], mapToMenuItem);
