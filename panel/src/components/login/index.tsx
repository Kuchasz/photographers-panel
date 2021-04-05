import * as React from 'react';
import { Button, Form, FormGroup, ControlLabel, FormControl, HelpBlock, ButtonToolbar, Alert } from 'rsuite';
import { ResultType } from '@pp/api/common';
import { loginModel } from './login-model';
import { FormInstance } from 'rsuite/lib/Form/index.d.ts';
import { UserCredentials, logIn } from '@pp/api/panel/auth';
import './styles.less';
import { Redirect } from 'react-router-dom';
import { logIn as stateLogIn } from '../../security';
import { routes } from '../../routes';
import { isLoggedIn } from '../../security';
import { translations } from '../../i18n';

const emptyLogin = () => ({ username: '', password: '' });

interface Props {}

export const LogIn = ({}: Props) => {
    const [formState, setFormState] = React.useState<UserCredentials>(emptyLogin());
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [hasLoggedIn, setHasLoggedIn] = React.useState<boolean>(isLoggedIn());
    const formRef = React.useRef<FormInstance>();

    const submitLogIn = async () => {
        if (formRef.current) {
            const result = await formRef.current.checkAsync();
            if (result.hasError) return;
            setIsLoading(true);
            logIn(formState).then((result) => {
                if (result.type === ResultType.Success) {
                    Alert.success(translations.login.logged);
                    stateLogIn(new Date().getTime() + (result.result!.expireDate - result.result!.issuedAt) * 1000);
                    setIsLoading(false);
                    setHasLoggedIn(true);
                } else {
                    Alert.error(translations.login.notLogged);

                    setIsLoading(false);
                }
            });
        }
    };

    return hasLoggedIn ? (
        <Redirect to={routes.home} />
    ) : (
        <div className="login">
            <Form
                ref={formRef}
                model={loginModel()}
                formValue={formState}
                onChange={(x) => setFormState(x as UserCredentials)}>
                <FormGroup>
                    <ControlLabel>{translations.login.loginLabel}</ControlLabel>
                    <FormControl style={{ width: 350 }} name="username" />
                    <HelpBlock tooltip>{translations.login.loginTooltip}</HelpBlock>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>{translations.login.passwordLabel}</ControlLabel>
                    <FormControl style={{ width: 350 }} name="password" type="password" />
                    <HelpBlock tooltip>{translations.login.passwordTooltip}</HelpBlock>
                </FormGroup>
                <FormGroup>
                    <ButtonToolbar>
                        <Button onClick={submitLogIn} appearance="primary" loading={isLoading}>
                            {translations.login.button}
                        </Button>
                        <button onClick={submitLogIn} style={{ visibility: 'hidden' }} type="submit"></button>
                    </ButtonToolbar>
                </FormGroup>
            </Form>
        </div>
    );
};
