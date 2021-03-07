import { Schema } from "rsuite";
import { checkPasswordIsUnique } from "@pp/api/panel/private-gallery";
import { PrivateGalleryState } from "@pp/api/private-gallery";
import { translations } from "../../i18n";

export const galleryModel = (galleryId?: number) => Schema.Model({
    date: Schema.Types.DateType()
        .isRequired(translations.validation.required),
    title: Schema.Types.StringType()
        .isRequired(translations.validation.required)
        .minLength(10, translations.validation.minLength(10)),
    notes: Schema.Types.StringType()
        .isRequired(translations.validation.required)
        .minLength(10, translations.validation.minLength(10)),
    state: Schema.Types.NumberType()
        .isRequired(translations.validation.required)
        .isOneOf(
            [PrivateGalleryState.Available, PrivateGalleryState.NotReady, PrivateGalleryState.TurnedOff],
            translations.validation.oneOf
        ),
    password: Schema.Types.StringType()
        .isRequired(translations.validation.required)
        .containsUppercaseLetter(translations.validation.containUppercaseLetter)
        .containsLowercaseLetter(translations.validation.containLowercaseLetter)
        .containsNumber(translations.validation.containNumber)
        .minLength(8, translations.validation.minLength(8))
        .addRule(checkPasswordIsUnique(galleryId), translations.validation.unique),
    directPath: Schema.Types.StringType()
        .isURL(translations.validation.url)
        .pattern(/https:\/\/[\w.]+[^\/]$/, translations.validation.pattern("https://example.com")),
    blog: Schema.Types.NumberType()
});
