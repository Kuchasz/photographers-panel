import React from "react";
import { getOffer, OfferEntry } from "@pp/api/dist/site/offer";
import { Headers } from "../components/headers";

const getImageBackgroundStyle = (url: string) => {
    return {
        backgroundImage: `url(${url})`,
    };
};

type Offer = { title: string; photos: string[]; description: string };
type OfferProps = { alias: string; initialState: OfferEntry };

export const Offer = ({ alias, initialState }: OfferProps) => {
    const [offer, setOffer] = React.useState(initialState ?? {});

    React.useEffect(() => {
        getOffer(alias).then(setOffer);
    }, []);

    return (
        <>
            <Headers title={offer.title}></Headers>
            <div className="sub_sub offer-details">
                <section>
                    <article>
                        <h1>{offer.title}</h1>

                        {offer.photos?.length > 0 ? (
                            <div className="slides">
                                {offer.photos.map((p) => (
                                    <div className="slide" key={p.url} style={getImageBackgroundStyle(p.url)}></div>
                                ))}
                            </div>
                        ) : null}

                        <div className="content" dangerouslySetInnerHTML={{ __html: offer.description }}></div>
                    </article>
                </section>
            </div>
        </>
    );
};
