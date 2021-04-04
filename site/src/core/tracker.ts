import MatomoTracker from '@datapunt/matomo-tracker-js'
import { get } from '../config';

let _tracker: MatomoTracker;

export const getTracker = () => {
    const config = get();

    if (!_tracker)
        _tracker = new MatomoTracker({
            urlBase: config.stats.urlBase,
            siteId: config.stats.siteId,
            userId: undefined,//'UID76903202', // optional, default value: `undefined`.
            //   trackerUrl: 'https://LINK.TO.DOMAIN/tracking.php', // optional, default value: `${urlBase}matomo.php`
            //   srcUrl: 'https://LINK.TO.DOMAIN/tracking.js', // optional, default value: `${urlBase}matomo.js`
            disabled: false, // optional, false by default. Makes all tracking calls no-ops if set to true.
            heartBeat: { // optional, enabled by default
                active: true, // optional, default value: true
                seconds: 10 // optional, default value: `15
            },
            linkTracking: false, // optional, default value: true
            configurations: { // optional, default value: {}
                // any valid matomo configuration, all below are optional
                disableCookies: true,
                // setSecureCookie: true,
                setRequestMethod: 'POST'
            }
        });

    return _tracker;
};