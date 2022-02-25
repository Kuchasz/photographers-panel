import React from 'react';
import { strings } from '../resources';

export const Head = () => (
    <head>
        <meta name="Description" content={strings.head.description} />
        <meta name="Keywords" content={strings.head.keywords} />
        <link rel="stylesheet" href="/media/css/style.css"></link>
        <link rel="stylesheet" href="/media/css/ie11.css"></link>
        <link rel="stylesheet" href="/media/css/slide.css"></link>
        <title>{strings.head.title}</title>
    </head>
);
