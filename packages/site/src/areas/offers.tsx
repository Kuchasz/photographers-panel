import React from "react";
import { getOffersList, OfferEntry, OfferListItem } from "@pp/api/dist/site/offer";
import { Link } from "react-router-dom";
import { routes } from "@pp/api/dist/site/routes";
import { strings } from "../resources";

const getOfferUrl = (alias: string) => routes.offer.route.replace(':alias', alias);

const getImageBackgroundStyle = (url: string) => {
    return {
        backgroundImage: `url(${url})`,
    };
};

export const Offers = ({ initialState }: { initialState: { offer: OfferEntry; offers: OfferListItem[] } }) => {
    const [offers, setOffers] = React.useState(initialState.offers ?? []);
    const [offer, setOffer] = React.useState(initialState.offer ?? {});


    React.useEffect(() => {
        getOffersList().then(x => {
            setOffers(x.offers);
            setOffer(x.offer);
        });
    }, []);

    return (
        <div className="offers">
            <section>
                <article>
                    <h1>{strings.offer.wedding.title}</h1>
                    <h2>{strings.offer.wedding.description}</h2>

                    <article>
                        {offer.photos?.length > 0 ? (
                            <div className="slides">
                                {offer.photos.map((p) => (
                                    <div className="slide" key={p.url} style={getImageBackgroundStyle(p.url)}></div>
                                ))}
                            </div>
                        ) : null}
                        <div className="content" dangerouslySetInnerHTML={{ __html: offer.description }}></div>
                    </article>

                </article>
                <article>
                    <h1>{strings.offer.other.title}</h1>
                    <h2>{strings.offer.other.description}</h2>
                    {offers.filter((_i, id) => id > 3).map((o) => (
                        <Link to={getOfferUrl(o.alias)} key={o.alias}>
                            <li className="category">
                                <img src={o.photoUrl} alt={o.title} />
                                <div className="details">
                                    <h1>{o.title}</h1>
                                    <h2>{o.summary}</h2>
                                </div>
                            </li>
                        </Link>
                    ))}
                </article>
            </section>
        </div>
    );
};

// <section>

// {/* <ul>
//     {offers.map(o => <Link to={getOfferUrl(offer.alias)} key={offer.alias}>
//         <li className="category">
//             <img src={getOfferImage(offer.photo)} alt={offer.title} />
//             <h1>{offer.title}</h1>
//             <h2>{offer.short}</h2>
//         </li></Link>)}
// </ul> */}
//     </section>
