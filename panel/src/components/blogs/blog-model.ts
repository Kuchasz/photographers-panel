import { Schema } from "rsuite";
import { checkAliasIsUnique, BlogEditDto } from "@pp/api/panel/blog";

export const blogModel = (blogId?: number) => Schema.Model({
    title: Schema.Types.StringType()
        .isRequired("Title of the blog must be set.")
        .minLength(10, "Title of the blog must be at least 10 characters long.")
        .maxLength(200, "Title may not be longer than 200 characters."),
    alias: Schema.Types.StringType()
        .isRequired("Alias of the blog must be set.")
        .minLength(10, "Alias of the blog must be at least 10 characters long.")
        .maxLength(200, "Alias may not be longer than 200 characters.")
        .pattern(/^[a-z0-9-]*$/, "Alias may contain only lowercase a-z letters")
        .pattern(/^([a-z0-9]+-){3,}([a-z0-9]+)$/, "Alias must match pattern my-new-blog-post")
        .addRule(checkAliasIsUnique(blogId), "Alias must be unique."),
    date: Schema.Types.DateType()
        .isRequired("Date of the blog must be set."),
    content: Schema.Types.StringType()
        .isRequired("Content of the blog must be set.")
        .minLength(20, "Content of the blog must be at least 20 characters long.")
        .maxLength(1000, "Content may not be longer than 200 characters."),
    tags: Schema.Types.StringType()
        .isRequired("Tags of the blog must be set.")
        .minLength(20, "Tags of the blog must be at least 20 characters long.")
        .maxLength(100, "Tags may not be longer than 200 characters.")
        .pattern(/^[a-z0-9-]*$/, "Tags may contain only lowercase a-z letters")
        .pattern(/^([a-z0-9]+-){4,}([a-z0-9]+)$/, "Tags must match pattern awesome-wedding-photo-blog")
});

export const emptyBlog = (): BlogEditDto => ({
    title: "",
    alias: "",
    date: "",
    content: "",
    tags: "",
    hasAssignments: false
});