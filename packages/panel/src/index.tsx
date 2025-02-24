import 'chartist/dist/scss/chartist.scss';
import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import 'rsuite/lib/styles/index.less';
import { Root } from './components/root/index';
import './index.less';

render(
    <BrowserRouter basename="/panel">
        <Root />
    </BrowserRouter>,
    document.querySelector('#root')
);
