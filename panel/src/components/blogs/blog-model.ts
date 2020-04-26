import { Schema } from "rsuite";
import { checkAliasIsUnique, BlogEditDto } from "../../../../api/panel/blog";

export const blogModel = (blogId?: number) => Schema.Model({
    title: Schema.Types.StringType()
        .isRequired("Title of the blog must be set.")
        .minLength(10, "Title of the blog must be at least 10 characters long."),
    alias: Schema.Types.StringType()
        .isRequired("Alias of the blog must be set.")
        .minLength(10, "Alias of the blog must be at least 10 characters long.")
        .pattern(/^([a-z]+-){3,}([a-z]+)$/, "Alias must match pattern my-new-blog-post")
        .addRule(checkAliasIsUnique(blogId), "Alias must be unique."),
    date: Schema.Types.DateType()
        .isRequired("Date of the blog must be set."),
    content: Schema.Types.StringType()
        .isRequired("Content of the blog must be set.")
        .minLength(20, "Content of the blog must be at least 20 characters long."),
    tags: Schema.Types.StringType()
        .isRequired("Tags of the blog must be set.")
        .minLength(20, "Tags of the blog must be at least 20 characters long.")
        .pattern(/^([a-z]+-){4,}([a-z]+)$/, "Tags must match pattern awesome-wedding-photo-blog")
});

export const emptyBlog = (): BlogEditDto => ({
    title: "",
    alias: "",
    date: "",
    content: "",
    tags: "",
    hasAssignments: false
});