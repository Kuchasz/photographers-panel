import React from 'react';
import Head from 'next/head';
import { strings } from '../resources';

export const CustomHead = () => (
    <Head>
        <meta name="Description" content={strings.head.description} />
        <meta name="Keywords" content={strings.head.keywords} />
        <title>{strings.head.title}</title>
    </Head>
);
