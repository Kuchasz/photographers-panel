import * as React from "react";
import { Icon, Panel } from "rsuite/lib";

const sections: {icon: any, value: number, label: string}[] = [
    {icon: 'image', value: 22, label: 'Galleries'},
    {icon: 'tv', value: 16800, label: 'Visits'},
    {icon: 'comments', value: 7, label: 'Unread comments'}
];

export class Dashboard extends React.Component {
    render() {
        return <>
            {sections.map(section => <Panel key={section.icon}><Icon icon={section.icon}/>{section.value}</Panel>)}
        </>
    }
}