import { getPayload, } from 'payload'
import config from '~/payload.config'
import { SITE_VISITS_SLUG } from '../collectionSlugs';

const getPathFromReferer = (referrer: string) => {
    const url = new URL(referrer);
    return url.pathname;
}

export const registerVisit = async (ip: string, userAgent: string, referrer: string) => {

    const payload = await getPayload({
        config: config,
    });

    const visit = await payload.create({
        collection: SITE_VISITS_SLUG,
        data: { ip, userAgent, referrer, path: getPathFromReferer(referrer), date: new Date().toISOString() },
    })

    return visit
}