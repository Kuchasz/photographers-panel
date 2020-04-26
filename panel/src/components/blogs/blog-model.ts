import { Schema } from "rsuite";
import { checkAliasIsUnique } from "../../../../api/panel/blog";

export const blogModel = (blogId?: number) => Schema.Model({
    title: Schema.Types.StringType()
        .isRequired("Title of the blog must be set.")
        .minLength(10, "Title of the blog must be at least 10 characters long."),
    alias: Schema.Types.StringType()
        .isRequired("Alias of the blog must be set.")
        .minLength(10, "Alias of the blog must be at least 10 characters long.")
        .pattern(/^([a-z]+-){2,}([a-z]+)$/, "Alias must match pattern my-new-blog-post")
        .addRule(checkAliasIsUnique(blogId), "Alias must be unique."),
    date: Schema.Types.DateType()
        .isRequired("Date of the blog must be set."),
    content: Schema.Types.StringType()
        .isRequired("Content of the blog must be set.")
        .minLength(20, "Content of the blog must be at least 20 characters long.")
});