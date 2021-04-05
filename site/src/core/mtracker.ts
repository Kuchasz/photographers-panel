export class MatomoTracker {
    private readonly siteId: number;
    private readonly trackerUrl: string;

    constructor(siteId: number, trackerUrl: string) {
        if (!siteId || typeof siteId !== 'number' || typeof siteId !== 'string') new Error('Matomo siteId required.');
        if (!trackerUrl || typeof trackerUrl !== 'string')
            new Error('Matomo tracker URL required, e.g. http://example.com/matomo.php');

        this.siteId = siteId;
        this.trackerUrl = `${trackerUrl}/matomo.php`;
    }

    async trackEvent(options: MatomoTrackOptions): Promise<void | string> {
        // if (typeof options === 'string') {
        //   options = {
        //     url: options
        //   };
        // }

        // // Set mandatory options
        // // options = options || {};
        // if (!options || !options.url) {
        //   return Promise.reject('URL to be tracked must be specified.');
        // }
        options.idsite = this.siteId;
        options.rec = 1;

        const body = new FormData();
        Object.entries(options).forEach((x) => body.append(x[0], x[1] as string));

        try {
            await fetch(this.trackerUrl, { method: 'POST', body });
            return Promise.resolve();
        } catch (err) {
            return Promise.reject(err);
        }
    }
}

interface MatomoSingleTrackOptions extends MatomoTrackOptions {
    url: string;
}

interface MatomoTrackOptions {
    // [key: string]: number | string | undefined

    idsite?: number;
    rec?: 1;

    // Recommended parameters
    action_name?: string;
    _id?: string;
    rand?: string;
    apiv?: 1;

    // Optional User info
    urlref?: string;
    _cvar?: string;
    _idvc?: string;
    _viewts?: string;
    _idts?: string;
    _rcn?: string;
    _rck?: string;
    res?: string;
    h?: number;
    m?: number;
    s?: number;
    fla?: 1;
    java?: 1;
    dir?: 1;
    qt?: 1;
    pdf?: 1;
    wma?: 1;
    ag?: 1;
    cookie?: 1;
    ua?: string;
    lang?: string;
    uid?: string;
    cid?: string;
    new_visit?: number;

    // Optional Action info
    cvar?: string;
    link?: string;
    download?: string;
    search?: string;
    search_cat?: string;
    search_count?: number;
    pv_id?: string;
    idgoal?: number;
    revenue?: number;
    gt_ms?: number;
    cs?: string;
    ca?: 1;

    // Optional Event Tracking info
    e_c?: string;
    e_a?: string;
    e_n?: string;
    e_v?: number;

    // Optional Content Tracking info
    c_n?: string;
    c_p?: string;
    c_t?: string;
    c_i?: string;

    // Optional Ecommerce info
    ec_id?: string;
    ec_items?: string;
    ec_st?: number;
    ec_tx?: number;
    ec_sh?: number;
    ec_dt?: number;
    _ects?: number;

    // Other parameters (require authentication via token_auth)
    token_auth?: string;
    cip?: string;
    cdt?: string;
    country?: string;
    region?: string;
    city?: string;
    lat?: string;
    long?: string;

    // Optional Media Analytics parameters
    ma_id?: string;
    ma_ti?: string;
    ma_re?: string;
    ma_mt?: 'video' | 'audio';
    ma_pn?: string;
    ma_sn?: number;
    ma_le?: number;
    ma_ps?: number;
    ma_ttp?: number;
    ma_w?: number;
    ma_h?: number;
    ma_fs?: 1 | 0;
    ma_se?: string;

    // Optional Queued Tracking parameters
    queuedtracking?: 0;

    // Other parameters
    send_image?: 0;
    ping?: 1;
    bots?: 1;
}
