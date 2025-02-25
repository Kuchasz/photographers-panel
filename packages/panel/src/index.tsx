// import 'chartist/dist/scss/chartist.scss';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
// import { BrowserRouter } from 'react-router';
// import 'rsuite/lib/styles/index.less';
import 'rsuite/styles/index.less';
import { Root } from './components/root/index';
import './index.less';
import { BrowserRouter } from 'react-router-dom';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

root.render(
    <BrowserRouter basename="/panel">
        <Root />
    </BrowserRouter>
);
