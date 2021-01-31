import React from "react";
import { Link } from "react-router-dom";
import { strings } from "../resources";
import { routes } from "@pp/api/site/routes";
import { includesAll, distinctBy, includesAny } from "@pp/utils/array";
import { OfferListItem, getOffersList } from "@pp/api/site/offer";
import linkPhoto from "../images/page_offer_photo.png";

const getOfferUrl = (alias: string) => `${routes.offers.route}/${alias}`;

type TariffYears = 2021 | 2022 | 2023;
type TariffPositions = "WeddingPhotography" | "WeddingVideo" | "DvdPackage" | "Afters" | "WeddingSession";
type TariffValues = { [P in TariffYears]: number };
type Tariff = { type: TariffPositions; requires: TariffPositions[]; prices: TariffValues };
type PriceAdjustment = { requires?: TariffPositions[]; requiresAll?: TariffPositions[]; appliesTo: TariffPositions; adjustment: TariffValues };

const tariffPositions: Tariff[] = [
    { type: "WeddingPhotography", requires: [], prices: { 2021: 1800, 2022: 1900, 2023: 1900 } },
    { type: "WeddingVideo", requires: [], prices: { 2021: 1800, 2022: 1900, 2023: 1900 } },
    { type: "WeddingSession", requires: [], prices: { 2021: 600, 2022: 600, 2023: 600 } },
    { type: "DvdPackage", requires: ["WeddingVideo"], prices: { 2021: 300, 2022: 300, 2023: 300 } },
    { type: "Afters", requires: ["WeddingPhotography", "WeddingVideo"], prices: { 2021: 200, 2022: 200, 2023: 200 } }
];

const priceAdjustments: PriceAdjustment[] = [
    {
        requires: ["WeddingPhotography", "WeddingVideo"],
        appliesTo: "WeddingPhotography",
        adjustment: { 2021: -1300, 2022: -1300, 2023: -1300 }
    },
    {
        requires: ["WeddingSession", "WeddingPhotography"],
        appliesTo: "WeddingSession",
        adjustment: { 2021: -300, 2022: -300, 2023: -300 }
    },
    {
        requires: ["WeddingSession", "WeddingVideo"],
        appliesTo: "WeddingSession",
        adjustment: { 2021: -300, 2022: -300, 2023: -300 }
    },
    {
        requiresAll: ["WeddingPhotography", "WeddingVideo", "Afters"],
        appliesTo: "Afters",
        adjustment: { 2021: 200, 2022: 200, 2023: 200 }
    }
];

const tariffYears: TariffYears[] = [2021, 2022, 2023];

const updateTariffs = (
    selectedTariffs: TariffPositions[],
    action: { type: "Select" | "Deselect"; tariff: TariffPositions }
) => {
    switch (action.type) {
        case "Select":
            return [...selectedTariffs, action.tariff];
        case "Deselect": {
            const tariffs = selectedTariffs.filter(t => t !== action.tariff);
            return tariffs.filter(t => available(tariffs)(tariffPositions.filter(tt => tt.type === t)[0]));
        }
        default:
            throw Error("Not supported action type!");
    }
};

const calculatePrice = (selectedTariffs: TariffPositions[], selectedYear: TariffYears) => {
    const basePrice = tariffPositions
        .filter(tp => selectedTariffs.includes(tp.type))
        .map(tp => tp.prices[selectedYear])
        .reduce((acc, cur) => acc + cur, 0);

    const applicablePriceAdjustments = distinctBy(
        priceAdjustments.filter(d => d.requires ? includesAll(selectedTariffs, d.requires) : includesAll(selectedTariffs, d.requiresAll!)),
        d => d.appliesTo);

    const priceAdjustment = applicablePriceAdjustments.map(d => d.adjustment[selectedYear]).reduce((acc, cur) => acc + cur, 0);

    return { basePrice, finalPrice: basePrice + priceAdjustment };
};

const available = (selectedTariffs: TariffPositions[]) => (tariff: Tariff) =>
    includesAny(selectedTariffs, tariff.requires);

export const Offers = ({ initialState }: { initialState: OfferListItem[] }) => {
    const [selectedYear, selectYear] = React.useState(tariffYears[0]);
    const [selectedTariffs, changeTariffs] = React.useReducer(updateTariffs, [
        "WeddingPhotography",
        "WeddingVideo",
        "WeddingSession"
    ]);
    const [offers, setOffers] = React.useState(initialState ?? []);

    React.useEffect(() => {
        getOffersList().then(setOffers);
    }, []);

    const price = calculatePrice(selectedTariffs, selectedYear);

    return (
        <div className="offers">
            <section>
                <article>
                    <h1>{strings.offer.calculator.title}</h1>
                    <h2>{strings.offer.calculator.description}</h2>
                    <div className="tariffs">
                        <div className="selector">
                            {tariffYears.map(t => (
                                <a
                                    key={t}
                                    className={t === selectedYear ? "current" : ""}
                                    onClick={() => selectYear(t)}
                                >
                                    {t}
                                </a>
                            ))}
                        </div>
                        <div className="rules">
                            {tariffPositions.map(t => (
                                <label
                                    className={`rule ${available(selectedTariffs)(t) ? "" : "disabled"}`}
                                    key={t.type}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedTariffs.includes(t.type)}
                                        onChange={e =>
                                            changeTariffs({
                                                type: e.target.checked ? "Select" : "Deselect",
                                                tariff: t.type
                                            })
                                        }
                                    />
                                    {strings.offer.tariffs[t.type]}
                                </label>
                            ))}
                        </div>
                        <div className="summary">
                            {price.basePrice === price.finalPrice ? (
                                <span>
                                    Cena:<span className="final">{price.basePrice} zł</span>
                                </span>
                            ) : (
                                    <>
                                        <span>
                                            Cena:<span className="old">{price.basePrice} zł</span>
                                        </span>
                                        <br />
                                        <span>
                                            Cena z rabatem:
                                        <span className="final">
                                                <strong>{price.finalPrice} zł</strong>
                                            </span>
                                        </span>
                                    </>
                                )}
                        </div>
                    </div>
                </article>
                <hgroup>
                    <img src={linkPhoto} alt="" />
                </hgroup>
                <br />
                <br />
                <article>
                    <h1>{strings.offer.title}</h1>
                    <h2>{strings.offer.description}</h2>
                    {offers.map(o => (
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
