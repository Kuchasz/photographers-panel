import en from "./lang/en";
import pl from "./lang/pl";

type translationsType = typeof en;

const availableTranslations: { [key: string]: translationsType } = {
    en: en,
    pl: pl,
};
const browserLanguages = window.navigator.languages;

const desiredLanguage = browserLanguages.find((l) => availableTranslations[l] !== undefined) ?? 'en';
const translation = availableTranslations[desiredLanguage];

// console.log(browserLanguages, translation);

export const translations = translation || en;
