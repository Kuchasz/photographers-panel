import * as React from 'react';
import {List} from 'semantic-ui-react';

interface Gallery {
    id: number;
    date: string;
    place: string;
    bride: string;
    groom: string;
    lastname: string;
    state: string;
    pass: string;
    dir: string;
    BlogEntryId: string;
}

interface Props {

}

interface State {
    galleries: Gallery[];
}

export class Galleries extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            galleries: []
        }
    }

    componentDidMount() {
        fetch('http://api.pyszstudio.pl/Galleries/Index')
            .then(resp => resp.json())
            .then((galleries: Gallery[]) => this.setState({galleries}));
    }

    render() {
        const {galleries} = this.state;
        return <List>
            {galleries.map(gallery => <List.Item key={gallery.id}>
                <List.Header>{gallery.bride}, {gallery.groom}</List.Header>
                {gallery.date}
            </List.Item>)}
        </List>;
    }
}