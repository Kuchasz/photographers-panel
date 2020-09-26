import { Schema } from "rsuite";

export const loginModel = () => Schema.Model({
    username: Schema.Types.StringType()
        .isRequired("Login is required.")
        .minLength(5, "Login must be at least 5 characters long."),
    password: Schema.Types.StringType()
        .isRequired("Password is required.")
        .minLength(5, "Password must be at least 5 characters long.")
});