import { connection } from "../db";
import { getDateString } from "../../../utils/date";
import { OfferListItem, OfferEntry } from "../../../api/offer";

export const getList = (): Promise<OfferListItem[]> =>
    new Promise((resolve, reject) => {
        connection.query(
            `
            SELECT o.title, o.alias, o.descshort, op.photourl, op.alttext FROM offer o 
            JOIN offerphoto op ON op.id = (
                SELECT id from offerphoto
                WHERE OfferId = o.id
                LIMIT 1)`,
            (_err, offers, _fields) => {
                const offerListItems = offers.map((o: any) => ({
                    title: o.title,
                    alias: o.alias,
                    photoUrl: `/media/images/offer/${o.photourl}`,
                    summary: o.descshort
                }));

                resolve(offerListItems);
            }
        );
    });

export const get = (alias: string): Promise<OfferEntry> =>
    new Promise((resolve, reject) => {
        connection.query(
            `
    SELECT o.title, o.desc, op.photourl, op.alttext
    FROM offer o 
    JOIN offerphoto op ON o.Id = op.OfferId
    WHERE o.alias LIKE '${alias}'
    `,
            (_err, offerPhotos, _fields) => {
                const [first] = offerPhotos;

                const offer: OfferEntry = {
                    title: first.title,
                    description: first.desc,
                    photos: offerPhotos.map((p: any) => ({
                        url: `/media/images/offer/${p.photourl}`,
                        altText: p.alttext
                    }))
                };

                resolve(offer);
            }
        );
    });
