import * as siteModel from "../../models/site";

export const getSiteVisits = async (req: any, res: any) => {
    const siteStats = await siteModel.getStats(new Date(req.params.start), new Date(req.params.end));
    res.json(siteStats);
};

export const getSiteEvents = async (req: any, res: any) => {
    const siteEvents = await siteModel.getEvents();
    res.json(siteEvents);
};
