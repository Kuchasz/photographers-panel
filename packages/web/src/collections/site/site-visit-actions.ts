import { getPayload, } from 'payload'
import config from '~/payload.config'
import { SITE_VISITS_SLUG } from '../collectionSlugs';

export const registerVisit = async (ip: string, userAgent: string, referrer: string, path: string) => {

    const payload = await getPayload({
        config: config,
    });

    const visit = await payload.create({
        collection: SITE_VISITS_SLUG,
        data: { ip, userAgent, referrer, path, date: new Date().toISOString() },
    })

    return visit
}