import { getDateString } from "@pp/utils/date";
import { endpoint } from "../common";
import { VisitsSummaryDto } from "./visits";

export interface SiteVisitsDto {
    todayVisits: number;
    totalVisits: number;
    rangeDays: number;
    rangeVisits: number;
    bestDay: VisitsSummaryDto;
    dailyVisits: VisitsSummaryDto[];
}

const getSiteVisitsRoute = "/api/panel/site-stats/:start/:end";
export const getSiteVisits = (
    startDate: Date,
    endDate: Date
): Promise<SiteVisitsDto> =>
    fetch(
        endpoint +
        getSiteVisitsRoute
            .replace(":start", getDateString(startDate))
            .replace(":end", getDateString(endDate))
    ).then(resp => resp.json());
getSiteVisits.route = getSiteVisitsRoute;