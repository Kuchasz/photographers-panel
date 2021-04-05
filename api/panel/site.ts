import { getDateString } from '@pp/utils/date';
import { f } from '../common';
import { VisitsSummaryDto } from './visits';

export interface SiteVisitsDto {
    todayVisits: number;
    totalVisits: number;
    rangeDays: number;
    rangeVisits: number;
    bestDay: VisitsSummaryDto;
    dailyVisits: VisitsSummaryDto[];
}

const getSiteVisitsRoute = '/api/panel/site-stats/:start/:end';
export const getSiteVisits = (startDate: Date, endDate: Date) =>
    f.get<SiteVisitsDto>(
        getSiteVisitsRoute.replace(':start', getDateString(startDate)).replace(':end', getDateString(endDate))
    );
getSiteVisits.route = getSiteVisitsRoute;
