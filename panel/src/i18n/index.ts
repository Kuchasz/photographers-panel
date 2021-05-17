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

    const timeDiff = ((olderDate.getTime() - 3_600_000) - now.getTime()) / 1000;

    if (Math.abs(timeDiff) < 60)
        return rtf.format(Math.floor(timeDiff), 'second');

    if (Math.abs(timeDiff / 60) < 60)
        return rtf.format(Math.floor(timeDiff / 60), 'minute');

    if (Math.abs(timeDiff / 3_600) < 24)
        return rtf.format(Math.floor(timeDiff / 3_600), 'hour');

    if (Math.abs(timeDiff / 86_400) < 30)
        return rtf.format(Math.floor(timeDiff / 86_400), 'day');

    if (Math.abs(timeDiff / 2_628_000) < 12)
        return rtf.format(Math.floor(timeDiff / 2_628_000), 'day');

    return rtf.format(Math.floor(timeDiff / (2_628_000 * 12)), 'year');
}