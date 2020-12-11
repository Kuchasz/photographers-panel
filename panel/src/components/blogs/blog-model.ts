import { Schema } from "rsuite";
import { checkAliasIsUnique, BlogEditDto } from "@pp/api/panel/blog";
import { translations } from "../../i18n";

export const blogModel = (blogId?: number) => Schema.Model({
    title: Schema.Types.StringType()
        .isRequired(translations.validation.required)
        .minLength(10, translations.validation.minLength(10))
        .maxLength(200, translations.validation.maxLength(200)),
    alias: Schema.Types.StringType()
        .isRequired(translations.validation.required)
        .minLength(10, translations.validation.minLength(10))
        .maxLength(200, translations.validation.maxLength(200))
        .pattern(/^[a-z0-9-]*$/, translations.validation.lowercaseAndNumbers)
        .pattern(/^([a-z0-9]+-){3,}([a-z0-9]+)$/, translations.validation.pattern("aaa-bbb-ccc"))
        .addRule(checkAliasIsUnique(blogId), translations.validation.unique),
    date: Schema.Types.DateType()
        .isRequired(translations.validation.required),
    content: Schema.Types.StringType()
        .isRequired(translations.validation.required)
        .minLength(20, translations.validation.minLength(20))
        .maxLength(1000, translations.validation.maxLength(1000)),
    tags: Schema.Types.StringType()
        .isRequired(translations.validation.required)
        .minLength(20, translations.validation.minLength(20))
        .maxLength(100, translations.validation.maxLength(100))
        .pattern(/^[a-z0-9-]*$/, translations.validation.lowercaseAndNumbers)
        .pattern(/^([a-z0-9]+-){4,}([a-z0-9]+)$/, translations.validation.pattern("aaa-bbb-ccc-ddd"))
});

export const emptyBlog = (): BlogEditDto => ({
    title: "",
    alias: "",
    date: "",
    content: "",
    tags: "",
    hasAssignments: false
});