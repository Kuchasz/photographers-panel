import LocalizedStrings from "react-localization";
import { pl } from "./pl";

type Localizations = typeof pl;

export const strings = new LocalizedStrings<Localizations>({
    pl
})