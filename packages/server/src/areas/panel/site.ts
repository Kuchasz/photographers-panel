import * as site from "@pp/api/dist/panel/site";
import * as siteModel from "../../models/site";

export const getSiteVisits = async (startDate: Date, endDate: Date): Promise<site.SiteVisitsDto> => {
    return await siteModel.getStats(startDate, endDate);
};

export const getSiteEvents = async (): Promise<site.SiteEventDto[]> => {
    return await siteModel.getEvents();
};
