import * as React from "react";
import {Menu, MenuItemProps} from "semantic-ui-react";
import {Dashboard} from "../dashboard/index";

const menuItems = ['Stats', 'Emails', 'Galleries', 'Blogs', 'Comments'];

export class Root extends React.Component {
    state: {activeItem: string} = { activeItem: 'Stats' };

    handleItemClick = (e: any, { name }: MenuItemProps) => this.setState({ activeItem: name })

    render() {
        const { activeItem } = this.state;

        return (
            <div>
                <Menu pointing secondary>
                    {menuItems.map(mi => <Menu.Item key={mi} name={mi} active={activeItem===mi} onClick={this.handleItemClick} />)}
                    <Menu.Menu position='right'>
                        <Menu.Item name='logout' active={activeItem === 'logout'} onClick={this.handleItemClick} />
                    </Menu.Menu>
                </Menu>
                    <Dashboard/>
            </div>
        )
    }
}