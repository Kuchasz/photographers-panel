import React from 'react';
import { Link } from 'react-router-dom';
import { strings } from '../resources';
import { routes } from '@pp/api/site/routes';
import { OfferListItem, getOffersList } from '@pp/api/site/offer';

const getOfferUrl = (alias: string) => routes.offer.route.replace(':alias', alias);

export const Offers = ({ initialState }: { initialState: OfferListItem[] }) => {
    const [offers, setOffers] = React.useState(initialState ?? []);

    React.useEffect(() => {
        getOffersList().then(setOffers);
    }, []);

    return (
        <div className="offers">
            <section>
                <article>
                    <h1>{strings.offer.title}</h1>
                    <h2>{strings.offer.description}</h2>
                    {offers.map((o) => (
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
//     {offers.map(o => <Link to={getOfferUrl(o.alias)} key={o.alias}>
//         <li className="category">
//             <img src={getOfferImage(o.photo)} alt={o.title} />
//             <h1>{o.title}</h1>
//             <h2>{o.short}</h2>
//         </li></Link>)}
// </ul> */}
//     </section>
