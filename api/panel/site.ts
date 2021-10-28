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

export interface SiteEventDto {
    label: string;
    nb_visits: number;
    nb_events: number;
    nb_events_with_value: number;
    sum_event_value: number;
    min_event_value: number;
    max_event_value: number;
    sum_daily_nb_uniq_visitors: number;
    avg_event_value: number;
    segment: string;
    idsubdatatable: number;
}

const getSiteVisitsRoute = '/api/panel/site-stats/:start/:end';
export const getSiteVisits = (startDate: Date, endDate: Date) =>
    f.get<SiteVisitsDto>(
        getSiteVisitsRoute.replace(':start', getDateString(startDate)).replace(':end', getDateString(endDate))
    );
getSiteVisits.route = getSiteVisitsRoute;

const getSiteEventsRoute = '/api/panel/site-events';
export const getSiteEvents = () =>
    f.get<SiteEventDto[]>(getSiteEventsRoute);
getSiteEvents.route = getSiteEventsRoute;