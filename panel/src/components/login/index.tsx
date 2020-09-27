import * as React from "react";
import { Button, Form, FormGroup, ControlLabel, FormControl, HelpBlock, ButtonToolbar, Alert } from "rsuite";
// import { BlogEditDto, editBlog, getBlogForEdit } from "../../../../api/panel/blog";
import { ResultType } from "../../../../api/common";
import { loginModel } from "./login-model";
import { FormInstance } from "rsuite/lib/Form/index.d.ts";
import { UserCredentials, logIn } from "../../../../api/panel/auth";
import "./styles.less";
import { Redirect } from "react-router-dom";
// import { doesHttpOnlyCookieExist } from "../../../../utils/auth";
import { logIn as stateLogIn } from "../../security";
import { routes } from "../../routes";
import { isLoggedIn } from "../../security";

const emptyLogin = () => ({ username: "", password: "" });

interface Props {
}

export const LogIn = ({ }: Props) => {
    const [formState, setFormState] = React.useState<UserCredentials>(emptyLogin());
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [hasLoggedIn, setHasLoggedIn] = React.useState<boolean>(isLoggedIn());
    const formRef = React.useRef<FormInstance>();

    const submitLogIn = async () => {
        console.log('submitLogIn');
        if (formRef.current) {
            const result = await formRef.current.checkAsync();
            if (result.hasError) return;
            setIsLoading(true);
            logIn(formState).then((result) => {
                if (result.type === ResultType.Success) {
                    Alert.success("Successfully logged-in!");
                    stateLogIn(new Date().getTime() + (result.result!.expireDate - result.result!.issuedAt) * 1000);
                    setIsLoading(false);
                    setHasLoggedIn(true);
                    // closeEditForm();
                    // onSaved();1
                } else {
                    Alert.error("An error occured while logging-in.");

                    setIsLoading(false);
                }
            });
        }
    };

    return hasLoggedIn ? <Redirect to={routes.home} /> : <div className="login">
        <Form
            ref={formRef}
            model={loginModel()}
            formValue={formState}
            onChange={(x) => setFormState(x as UserCredentials)}>
            <FormGroup>
                <ControlLabel>Login</ControlLabel>
                <FormControl style={{ width: 350 }} name="username" />
                <HelpBlock tooltip>Username needed to Login</HelpBlock>
            </FormGroup>
            <FormGroup>
                <ControlLabel>Password</ControlLabel>
                <FormControl style={{ width: 350 }} name="password" type="password" />
                <HelpBlock tooltip>Password needed to Login</HelpBlock>
            </FormGroup>
            <FormGroup>
                <ButtonToolbar>
                    <Button onClick={submitLogIn} appearance="primary" loading={isLoading}>Log In</Button>
                </ButtonToolbar>
            </FormGroup>
        </Form>
    </div>;
}