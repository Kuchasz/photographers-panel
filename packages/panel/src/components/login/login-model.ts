import { Schema } from 'rsuite';
import { translations } from '../../i18n';

export const loginModel = () =>
    Schema.Model({
        username: Schema.Types.StringType()
            .isRequired(translations.validation.required)
            .minLength(5, translations.validation.minLength(5)),
        password: Schema.Types.StringType()
            .isRequired(translations.validation.required)
            .minLength(5, translations.validation.minLength(5)),
    });
