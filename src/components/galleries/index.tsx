import * as React from 'react';
import {GalleriesList} from "./galleriesList.component";

interface Props {

}

interface State {
    selectedGallery?: number;
}


export class Galleries extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {selectedGallery: undefined};
    }

    render() {
        return <div>
            <GalleriesList onSelect={gallery => this.setState({selectedGallery: gallery})}/>
        </div>
    }
}