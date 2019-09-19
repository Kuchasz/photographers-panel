import React from "react";
import { Link } from "react-router-dom";
import { strings } from "../resources";
import { routes } from "../routes";

const offers = strings.offer.positions;
const getOfferImage = (imageFileName: string) => require(`../images/offers/${imageFileName}`);
const getOfferUrl = (alias: string) => `${routes.offer.route}/${alias}`;

export const Offers = () => <div className="offers">
    <section>
        <ul>
            {offers.map(o => <Link to={getOfferUrl(o.alias)} key={o.alias}>
                <li className="category">
                    <img src={getOfferImage(o.photo)} alt={o.title} />
                    <h1>{o.title}</h1>
                    <h2>{o.short}</h2>
                </li></Link>)}
        </ul>
    </section>
</div>