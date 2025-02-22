import React from 'react';
import Head from 'next/head';

type Props = { title: string };
const defaultProps: Props = {
    title: 'Fotografia, zdjęcia ślubne Andrychów, Bielsko, Wadowice, Kęty',
};

export const Headers = (passedProps: Partial<Props>) => {
    const props = { ...defaultProps, ...passedProps };

    return (
        <Head>
            <title>{props.title}</title>
            <meta
                name="description"
                content="Fotografia i filmowanie ślubów. Piękne zdjęcia, atrakcyjne ceny, działamy na terenie Krakowa, Andrychowa, Kęt, Wadowic, Bielska i całej Polski."
            />
        </Head>
    );
};
