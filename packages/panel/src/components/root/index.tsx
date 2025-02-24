import * as React from "react";
import { BlogAssignAssets } from "../blogs/blog-assign-assets";
import { Blogs } from "../blogs";
import { Dashboard } from "../dashboard/index";
import { Galleries } from "../galleries/index";
import { isLoggedIn } from "../../security";
import { LogIn } from "../login";
import { Menu } from "../menu/index";
import { NavBarInstance } from "../navbar";
import {
    Navigate,
    Route,
    Routes,
    useLocation
} from "react-router-dom";
import { routes } from "../../routes";
import { SiteStats } from "../site-stats";
import { Soon } from "../soon";

interface Props { }

export const Root: React.FC<Props> = () => {
    const location = useLocation();
    const canLogOut = location.pathname !== routes.login;
    const fullPageView =
        !canLogOut ||
        [routes.emails, routes.comments, routes.home, routes.stats].includes(location.pathname);

    if (!isLoggedIn() && canLogOut) {
        return <Navigate to={routes.login} />;
    }

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <NavBarInstance canLogOut={canLogOut} />
            <div id="layout">
                {canLogOut && (
                    <div>
                        <Menu />
                    </div>
                )}
                <div id="content" className={fullPageView ? 'full-page' : ''}>
                    <Routes>
                        <Route path={routes.home} element={<Dashboard />} />
                        <Route path={routes.stats} element={<SiteStats />} />
                        <Route path={routes.galleries} element={<Galleries />} />
                        <Route path={routes.emails} element={<Soon />} />
                        <Route path={routes.comments} element={<Soon />} />
                        <Route path={routes.blog.list} element={<Blogs />} />
                        <Route
                            path={routes.blog.assets}
                            element={
                                <BlogAssignAssets id={parseInt(location.pathname.split('/').pop() || '0')} />
                            }
                        />
                        <Route path={routes.login} element={<LogIn />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};
