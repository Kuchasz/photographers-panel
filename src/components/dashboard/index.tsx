import * as React from "react";
import {Statistic, Icon, SemanticICONS} from "semantic-ui-react";

const sections: {icon: SemanticICONS, value: number, label: string}[] = [
    {icon: 'envira gallery', value: 22, label: 'Galleries'},
    {icon: 'television', value: 16800, label: 'Visits'},
    {icon: 'comments', value: 7, label: 'Unread comments'}
];

export class Dashboard extends React.Component {
    render() {
        return <Statistic.Group size={'small'}>
            {sections.map(section => <Statistic key={section.label}>
                <Statistic.Value><Icon size={'tiny'} name={section.icon}/>{section.value}</Statistic.Value>
                <Statistic.Label>{section.label}</Statistic.Label>
            </Statistic>)}
        </Statistic.Group>
    }
}