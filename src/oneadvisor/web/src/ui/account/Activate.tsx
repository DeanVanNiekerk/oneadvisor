import { Alert, Form } from "antd";
import queryString from "query-string";
import React from "react";
import { connect, DispatchProp } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";

import { ValidationResult } from "@/app/validation/types";
import { RootState } from "@/state";
import { activate, resetPasswordSelector, signOut } from "@/state/auth";
import { ResetPasswordData } from "@/state/auth/types";
import { Button, FormErrors, FormField, FormInput, FormInputPassword } from "@/ui/controls";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

import { showMessage } from "../feedback/notifcation";
import Layout from "./Layout";

type Props = {
    fetching: boolean;
    failed: boolean;
    validationResults: ValidationResult[];
} & DispatchProp &
    RouteComponentProps;

type State = {
    userName: string;
    token: string;
    password: string;
    confirmPassword: string;
};

class Activate extends React.Component<Props, State> {
    constructor(props) {
        super(props);

        const values = queryString.parse(this.props.location.search);

        this.state = {
            userName: values.username as string,
            token: values.token as string,
            password: "",
            confirmPassword: "",
        };
    }

    handlePasswordChange = (fieldName: string, value: string) => {
        this.setState({
            password: value,
        });
    };

    handleConfirmPasswordChange = (fieldName: string, value: string) => {
        this.setState({
            confirmPassword: value,
        });
    };

    activate = () => {
        this.props.dispatch(signOut());

        const data: ResetPasswordData = {
            userName: this.state.userName,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            token: this.state.token,
        };
        this.props.dispatch(
            activate(data, () => {
                showMessage("success", "Activation Successful, Welcome to One Advisor", 4);
                this.props.history.push("/");
            })
        );
    };

    onKeyPress = (event) => {
        if (event.key === "Enter") {
            this.activate();
        }
    };

    render() {
        const { validationResults } = this.props;

        return (
            <Layout header="Activate Acccount" loading={this.props.fetching}>
                <Alert
                    message="Welcome to One Advisor, please choose a new password to activate your account."
                    type="info"
                    className="mb-1"
                />

                <FormErrors validationResults={validationResults} />

                <Form layout="vertical">
                    <FormInput
                        placeholder="Username"
                        fieldName="userName"
                        value={this.state.userName}
                        size="large"
                        prefix={<UserOutlined />}
                        validationResults={validationResults}
                        formFieldStyle={{
                            marginBottom: "10px",
                        }}
                        disabled={true}
                    />
                    <FormInputPassword
                        placeholder="Password"
                        fieldName="password"
                        value={this.state.password}
                        prefix={<LockOutlined />}
                        size="large"
                        onChange={this.handlePasswordChange}
                        validationResults={validationResults}
                        autoFocus={true}
                        formFieldStyle={{
                            marginBottom: "10px",
                        }}
                        onKeyPress={this.onKeyPress}
                    />
                    <FormInputPassword
                        placeholder="Confirm Password"
                        fieldName="confirmPassword"
                        value={this.state.confirmPassword}
                        prefix={<LockOutlined />}
                        size="large"
                        onChange={this.handleConfirmPasswordChange}
                        validationResults={validationResults}
                        formFieldStyle={{
                            marginBottom: "25px",
                        }}
                        onKeyPress={this.onKeyPress}
                    />

                    <FormField>
                        <Button
                            size="large"
                            noLeftMargin={true}
                            onClick={this.activate}
                            type="primary"
                            block={true}
                        >
                            Activate Account
                        </Button>
                    </FormField>
                </Form>
            </Layout>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const resetPasswordState = resetPasswordSelector(state);

    return {
        fetching: resetPasswordState.fetching,
        validationResults: resetPasswordState.validationResults,
    };
};

export default withRouter(connect(mapStateToProps)(Activate));
