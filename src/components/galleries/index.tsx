import * as React from 'react';
import {GalleriesList} from "./galleriesList";
import { GalleryVisits } from './galleryVisits';
import { VisitsSummary, Gallery, GalleriesVistsRootObject } from './state';
import { Panel } from "rsuite";


interface Props {

}

interface State {
    isLoading: boolean;
    visits: VisitsSummary[];
    galleries: Gallery[];
}

//http://api.pyszstudio.pl/Galleries/Visits?startDate=2017-09-09&endDate=2017-10-09&galleryId=189

const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};

export class Galleries extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            visits: [],
            isLoading: false,
            galleries: []
        };
    }

    componentDidMount() {
        fetch('http://api.pyszstudio.pl/Galleries/Index')
            .then(resp => resp.json())
            .then((galleries: Gallery[]) => {
                this.setState({galleries: galleries.map(x =>({...x, isSelected: false}))})
            });
    }

    onGallerySelected = (selectedGallery: number) => {
        
        this.setState(state => ({
            isLoading: true,
            galleries: state.galleries.map(x => 
                x.id === selectedGallery 
                    ? ({...x, isSelected: true})
                    : x.isSelected 
                        ? ({...x, isSelected: false})
                        : x
                    )
        }));

        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);

        fetch(`http://api.pyszstudio.pl/Galleries/Visits?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}&galleryId=${selectedGallery}`)
            .then(resp => resp.json())
            .then((resp: GalleriesVistsRootObject) => this.setState({isLoading: false, visits: resp.dailyVisits}));
    };

    render() {
        return <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Panel header={<h3>Gallery visits</h3>}>
                <GalleryVisits isLoading={this.state.isLoading} visits={this.state.visits}></GalleryVisits>
            </Panel>
            <Panel style={{willChange: 'transform', overflowY: 'auto'}} header={<h3>Galleries</h3>}>
                <GalleriesList galleries={this.state.galleries} onSelect={this.onGallerySelected}/>
            </Panel>
        </div>
    }
}