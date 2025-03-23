import { pl } from './pl';
import { en } from './en';

// For now, we're using Polish as the default language
export const strings = pl;

// Export both languages for future language switching implementation
export const languages = {
    pl,
    en
};

// new LocalizedStrings<Localizations>({
//     pl,
// });
