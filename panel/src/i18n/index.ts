import pl from './lang/pl';
import en from './lang/en';

type translationsType = typeof en;

const availableTranslations: { [key: string]: translationsType } = {
    en: en,
    pl: pl,
};
const browserLanguages = window.navigator.languages;

const desiredLanguage = browserLanguages.find((l) => availableTranslations[l] !== undefined) ?? '';
const translation = availableTranslations[desiredLanguage];

const intl = Intl as any;
const rtf = new intl.RelativeTimeFormat(desiredLanguage, { numeric: "auto", style: 'long' });

export const translations = translation || en;
export const formatDateTime = (date: Date) => {

    const olderDateString: any = date;

    const olderDate = new Date(olderDateString);
    const now = new Date();

    const timespan = (olderDate.getTime() - 3_600_000) - now.getTime();

    if (Math.abs(timespan / 1_000) < 60)
        return rtf.format(Math.floor(timespan / 1_000), 'second');

    if (Math.abs(timespan / 60_000) < 60)
        return rtf.format(Math.floor(timespan / 60_000), 'minute');

    if (Math.abs(timespan / 3_600_000) < 24)
        return rtf.format(Math.floor(timespan / 3_600_000), 'hour');

    if (Math.abs(timespan / 86_400_000) < 30)
        return rtf.format(Math.floor(timespan / 86_400_000), 'day');

    if (Math.abs(timespan / 2_628_000_000) < 12)
        return rtf.format(Math.floor(timespan / 2_628_000_000), 'day');
    
    return olderDateString;
    //return rtf.format(Math.floor(timespan / (2_628_000_000 * 12)), 'year');
}
