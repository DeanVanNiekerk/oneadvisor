import { Alert, Form, Icon } from 'antd';
import queryString from 'query-string';
import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { ValidationResult } from '@/app/validation';
import { resetPassword, ResetPasswordData, resetPasswordSelector, signOut } from '@/state/auth';
import { RootState } from '@/state/rootReducer';
import { Button, FormErrors, FormField, FormInput } from '@/ui/controls';

import { showMessage } from '../feedback/notifcation';
import Layout from './Layout';

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

class ResetPassword extends React.Component<Props, State> {
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

    componentDidMount() {
        this.props.dispatch(signOut());
    }

    handlePasswordChange = (fieldName: string, value: any) => {
        this.setState({
            password: value,
        });
    };

    handleConfirmPasswordChange = (fieldName: string, value: any) => {
        this.setState({
            confirmPassword: value,
        });
    };

    resetPassword = () => {
        const data: ResetPasswordData = {
            userName: this.state.userName,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            token: this.state.token,
        };
        this.props.dispatch(
            resetPassword(data, () => {
                showMessage(
                    "success",
                    "Your Password has been Successfully Reset",
                    4
                );
                this.props.history.push("/");
            })
        );
    };

    onKeyPress = event => {
        if (event.key === "Enter") {
            this.resetPassword();
        }
    };

    render() {
        const { validationResults } = this.props;

        return (
            <Layout header="Reset Password" loading={this.props.fetching}>
                <Alert
                    message="Please choose a new password."
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
                        prefix={<Icon type="user" />}
                        validationResults={validationResults}
                        formFieldStyle={{
                            marginBottom: "10px",
                        }}
                        disabled={true}
                    />
                    <FormInput
                        placeholder="Password"
                        fieldName="password"
                        value={this.state.password}
                        prefix={<Icon type="lock" />}
                        size="large"
                        onChange={this.handlePasswordChange}
                        validationResults={validationResults}
                        autoFocus={true}
                        formFieldStyle={{
                            marginBottom: "10px",
                        }}
                        type="password"
                        onKeyPress={this.onKeyPress}
                    />
                    <FormInput
                        placeholder="Confirm Password"
                        fieldName="confirmPassword"
                        value={this.state.confirmPassword}
                        prefix={<Icon type="lock" />}
                        size="large"
                        onChange={this.handleConfirmPasswordChange}
                        validationResults={validationResults}
                        formFieldStyle={{
                            marginBottom: "25px",
                        }}
                        type="password"
                        onKeyPress={this.onKeyPress}
                    />

                    <FormField>
                        <Button
                            size="large"
                            noLeftMargin={true}
                            onClick={this.resetPassword}
                            type="primary"
                            block={true}
                        >
                            Submit
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

export default withRouter(connect(mapStateToProps)(ResetPassword));
