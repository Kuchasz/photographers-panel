import MatomoTracker from '@datapunt/matomo-tracker-js'

// if ()
export const tracker = typeof document !== "undefined" ? new MatomoTracker({
    urlBase: localStorage.getItem("stats.urlBase") || "",
    siteId: Number(localStorage.getItem("stats.sideId")) || 0,
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
}) : undefined;

if (tracker)
    tracker.trackEvent({
        category: 'Site',
        action: 'Change Settings',
        name: 'Calculator', // optional
        // value: 123, // optional, numerical value
    });