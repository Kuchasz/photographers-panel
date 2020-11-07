import * as React from "react";
// import { Dashboard } from "../dashboard/index";
import { Menu } from "../menu/index";
import { Galleries } from "../galleries/index";
import { NavBarInstance } from "../navbar";
// import { Emails } from "../emails";
import { Blogs } from "../blogs";
import { Route, Redirect, RouteComponentProps, withRouter } from "react-router-dom";
// import { RouteComponentProps, withRouter } from "react-router-dom";
import { routes } from "../../routes";
import { LogIn } from "../login";
import { isLoggedIn } from "../../security";
import { Soon } from "../soon";
// import { doesHttpOnlyCookieExist } from "../../../../utils/auth";

interface Props extends RouteComponentProps {
}

interface State {
}

class RootComponent extends React.Component<Props, State> {
    render() {
        const canLogOut = this.props.location.pathname !== routes.login;
        const fullPageView = !canLogOut || [routes.emails, routes.comments, routes.home, routes.stats].includes(this.props.location.pathname);
        
        return !isLoggedIn() && canLogOut ? <Redirect to={routes.login}/> : <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <NavBarInstance canLogOut={canLogOut} />
                <div id="layout">
                    {canLogOut && <div>
                        <Menu />
                    </div>}
                    <div id="content" className={fullPageView ? "full-page" : ""}>
                        <Route exact path={routes.home} component={Soon} />
                        <Route exact path={routes.stats} component={Soon} />
                        <Route exact path={routes.galleries} component={Galleries} />
                        <Route exact path={routes.emails} component={Soon} />
                        <Route exact path={routes.comments} component={Soon} />
                        <Route exact path={routes.blogs} component={Blogs} />
                        <Route exact path={routes.login} component={LogIn} />
                    </div>
                </div>
            </div>
    }
}

export const Root = withRouter(props => <RootComponent {...props} />);