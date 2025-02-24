import * as React from "react";
import {
    Button,
    ButtonToolbar,
    Form,
    Message,
    useToaster
} from "rsuite";
import type { FormInstance } from 'rsuite';
import { isLoggedIn } from "../../security";
import { logIn as stateLogIn } from "../../security";
import { logIn, UserCredentials } from "@pp/api/dist/panel/auth";
import { loginModel } from "./login-model";
import { Navigate } from "react-router-dom";
import { ResultType } from "@pp/api/dist/common";
import { routes } from "../../routes";
import { translations } from "../../i18n";
import "./styles.less";

const emptyLogin = () => ({ username: '', password: '' });

interface Props {}

export const LogIn = ({}: Props) => {
    const [formState, setFormState] = React.useState<UserCredentials>(emptyLogin());
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [hasLoggedIn, setHasLoggedIn] = React.useState<boolean>(isLoggedIn());
    const [formError, setFormError] = React.useState({});
    const formRef = React.useRef<FormInstance>();
    const toaster = useToaster();

    const submitLogIn = async () => {
        if (!formRef.current) return;

        formRef.current.check();
        
        const result = await formRef.current.checkAsync();
        if (result.hasError) return;

        setIsLoading(true);
        logIn(formState).then((result) => {
            if (result.type === ResultType.Success) {
                toaster.push(
                    <Message type="success">{translations.login.logged}</Message>
                );
                stateLogIn(new Date().getTime() + (result.result!.expireDate - result.result!.issuedAt) * 1000);
                setIsLoading(false);
                setHasLoggedIn(true);
            } else {
                toaster.push(
                    <Message type="error">{translations.login.notLogged}</Message>
                );
                setIsLoading(false);
            }
        });
    };

    return hasLoggedIn ? (
        <Navigate to={routes.home} />
    ) : (
        <div className="login">
            <Form
                ref={formRef as React.Ref<FormInstance>}
                model={loginModel()}
                formValue={formState}
                formError={formError}
                onCheck={setFormError}
                onChange={(x) => setFormState(x as UserCredentials)}>
                <Form.Group>
                    <Form.ControlLabel>{translations.login.loginLabel}</Form.ControlLabel>
                    <Form.Control style={{ width: 350 }} name="username" />
                    <Form.HelpText tooltip>{translations.login.loginTooltip}</Form.HelpText>
                </Form.Group>
                <Form.Group>
                    <Form.ControlLabel>{translations.login.passwordLabel}</Form.ControlLabel>
                    <Form.Control style={{ width: 350 }} name="password" type="password" />
                    <Form.HelpText tooltip>{translations.login.passwordTooltip}</Form.HelpText>
                </Form.Group>
                <Form.Group>
                    <ButtonToolbar>
                        <Button onClick={submitLogIn} appearance="primary" loading={isLoading}>
                            {translations.login.button}
                        </Button>
                        <button onClick={submitLogIn} style={{ visibility: 'hidden' }} type="submit"></button>
                    </ButtonToolbar>
                </Form.Group>
            </Form>
        </div>
    );
};
