import { Schema } from "rsuite";

export const mainBlogsModel = Schema.Model({
    leftBlog: Schema.Types.NumberType(),
    rightBlog: Schema.Types.NumberType()
});
