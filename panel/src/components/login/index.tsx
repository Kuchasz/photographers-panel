import * as React from "react";
import { Button, Form, FormGroup, ControlLabel, FormControl, HelpBlock, ButtonToolbar, Alert } from "rsuite";
// import { BlogEditDto, editBlog, getBlogForEdit } from "../../../../api/panel/blog";
import { ResultType } from "../../../../api/common";
import { loginModel } from "./login-model";
import { FormInstance } from "rsuite/lib/Form/index.d.ts";
import { UserCredentials, logIn } from "../../../../api/panel/auth";

const emptyLogin = () => ({ username: "", password: "" });

interface Props {
}

export const LogIn = ({ }: Props) => {
    const [formState, setFormState] = React.useState<UserCredentials>(emptyLogin());
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const formRef = React.useRef<FormInstance>();

    const submitLogIn = async () => {
        console.log('submitLogIn');
        if (formRef.current) {
            const result = await formRef.current.checkAsync();
            console.log(result);
            if (result.hasError) return;
            setIsLoading(true);
            logIn(formState).then((result) => {
                if (result.type === ResultType.Success) {
                    Alert.success("Successfully logged-in!");
                    // closeEditForm();
                    // onSaved();1
                } else {
                    Alert.error("An error occured while logging-in.");
                }
                setIsLoading(false);
            });
        }
    };

    return (
        <Form
            ref={formRef}
            model={loginModel()}
            formValue={formState}
            onChange={(x) => setFormState(x as UserCredentials)}
        >
            <FormGroup>
                <ControlLabel>Login</ControlLabel>
                <FormControl style={{ width: 500 }} name="username" />
                <HelpBlock tooltip>Username needed to Login</HelpBlock>
            </FormGroup>
            <FormGroup>
                <ControlLabel>Password</ControlLabel>
                <FormControl style={{ width: 500 }} name="password" type="password" />
                <HelpBlock tooltip>Password needed to Login</HelpBlock>
            </FormGroup>
            <FormGroup>
                <ButtonToolbar>
                    <Button onClick={submitLogIn} appearance="primary" loading={isLoading}>
                        Save
                            </Button>
                    <Button
                        onClick={() => {
                            setIsLoading(false);
                            // closeEditForm();
                        }}
                        appearance="default"
                    >
                        Cancel
                            </Button>
                </ButtonToolbar>
            </FormGroup>
        </Form>
    );
};
