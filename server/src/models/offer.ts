import { connection } from "../db";
import { getDateString } from "../../../utils/date";
import { OfferListItem } from "../../../api/offer";

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
                    photoUrl: `http://pyszstudio.pl/media/images/offers/photo/${o.photourl}`,
                    summary: o.descshort
                }));

                resolve(offerListItems);
            }
        );
    });
