import * as React from 'react';
import { render, hydrate } from 'react-dom';
import { Root as RootComponent} from './root';
import './styles/slide.css';
import './styles/style.css';
import './styles/tablet.css';
import './styles/mobile.css';
import './index.less';
import { BrowserRouter } from 'react-router-dom';
import { StaticRouter, matchPath } from 'react-router';
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { initialize } from './config';

if (typeof document !== 'undefined') {
    let initialState: any = (window as any).___InitialState___;
    delete (window as any).___InitialState___;

    let serverConfig: any = (window as any).___ServerConfig___;
    initialize(serverConfig);

    delete (window as any).___ServerConfig___;

    hydrate(
        <BrowserRouter>
            <RootComponent initialState={initialState} />
        </BrowserRouter>,
        document.querySelector('#root')
    );

    for (var prop in initialState) delete initialState[prop];
    // for (var prop in serverConfig) delete serverConfig[prop];

    initialState = undefined;
    serverConfig = undefined;
}

export const Root = {
    Root: RootComponent,
    createElement: React.createElement,
    StaticRouter,
    renderToString,
    matchPath,
    renderStatic: Helmet.renderStatic,
    initializeConfig: initialize,
} as any;
