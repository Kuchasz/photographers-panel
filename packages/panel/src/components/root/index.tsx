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
    Redirect,
    Route,
    RouteComponentProps,
    withRouter
    } from "react-router-dom";
import { routes } from "../../routes";
import { SiteStats } from "../site-stats";
import { Soon } from "../soon";
// import { Emails } from "../emails";
// import { RouteComponentProps, withRouter } from "react-router-dom";

interface Props extends RouteComponentProps {}

interface State {}

class RootComponent extends React.Component<Props, State> {
    render() {
        const canLogOut = this.props.location.pathname !== routes.login;
        const fullPageView =
            !canLogOut ||
            [routes.emails, routes.comments, routes.home, routes.stats].includes(this.props.location.pathname);

        return !isLoggedIn() && canLogOut ? (
            <Redirect to={routes.login} />
        ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <NavBarInstance canLogOut={canLogOut} />
                <div id="layout">
                    {canLogOut && (
                        <div>
                            <Menu />
                        </div>
                    )}
                    <div id="content" className={fullPageView ? 'full-page' : ''}>
                        <Route exact path={routes.home} component={Dashboard} />
                        <Route exact path={routes.stats} component={SiteStats} />
                        <Route exact path={routes.galleries} component={Galleries} />
                        <Route exact path={routes.emails} component={Soon} />
                        <Route exact path={routes.comments} component={Soon} />
                        <Route exact path={routes.blog.list} component={Blogs} />
                        <Route
                            exact
                            path={routes.blog.assets}
                            render={(x: any) => {
                                return <BlogAssignAssets id={x.match.params.id} />;
                            }}
                        />
                        <Route exact path={routes.login} component={LogIn} />
                    </div>
                </div>
            </div>
        );
    }
}

export const Root = withRouter((props) => <RootComponent {...props} />);
