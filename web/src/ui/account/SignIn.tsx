import { Form, Icon } from 'antd';
import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { ValidationResult } from '@/app/validation';
import { Credentials, isAuthenticatedSelector, signIn, signInSelector } from '@/state/auth';
import { RootState } from '@/state/rootReducer';
import { Button, FormField, FormInput } from '@/ui/controls';

import Layout from './Layout';

type Props = {
    isAuthenticated: boolean;
    fetching: boolean;
    failed: boolean;
    validationResults: ValidationResult[];
} & DispatchProp &
    RouteComponentProps;

type State = {
    userName: string;
    password: string;
};

class SignIn extends React.Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            userName: "",
            password: "",
        };
    }

    componentDidMount() {
        if (this.props.isAuthenticated) {
            this.redirect();
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.isAuthenticated && !prevProps.isAuthenticated) {
            this.redirect();
        }
    }

    redirect = () => {
        this.props.history.push("/");
    };

    handleUserNameChange = (fieldName: string, value: any) => {
        this.setState({
            userName: value,
        });
    };

    handlePasswordChange = (fieldName: string, value: any) => {
        this.setState({
            password: value,
        });
    };

    signIn = () => {
        const credentials: Credentials = {
            userName: this.state.userName,
            password: this.state.password,
        };
        this.props.dispatch(signIn(credentials, () => {}));
    };

    onKeyPress = event => {
        if (event.key === "Enter") {
            this.signIn();
        }
    };

    forgotPassword = () => {
        this.props.history.push("/resetPasswordRequest");
    };

    render() {
        const { validationResults } = this.props;

        return (
            <Layout header="Sign In" loading={this.props.fetching}>
                <Form layout="vertical">
                    <FormInput
                        placeholder="Username"
                        fieldName="userName"
                        value={this.state.userName}
                        size="large"
                        prefix={<Icon type="user" />}
                        onChange={this.handleUserNameChange}
                        autoFocus={true}
                        formFieldStyle={{
                            marginBottom: "10px",
                        }}
                        onKeyPress={this.onKeyPress}
                    />
                    <FormInput
                        placeholder="Password"
                        fieldName="password"
                        value={this.state.password}
                        prefix={<Icon type="lock" />}
                        size="large"
                        onChange={this.handlePasswordChange}
                        formFieldStyle={{
                            marginBottom: "25px",
                        }}
                        type="password"
                        onKeyPress={this.onKeyPress}
                    />

                    {this.props.failed && (
                        <p className="text-error text-center mb-2">
                            {validationResults.map(r => (
                                <b>{r.errorMessage}</b>
                            ))}
                        </p>
                    )}

                    <FormField>
                        <Button size="large" noLeftMargin={true} onClick={this.signIn} type="primary" block={true}>
                            Sign In
                        </Button>
                    </FormField>
                </Form>

                <p className="text-center">
                    <a onClick={this.forgotPassword}>Forgot Password?</a>
                </p>
            </Layout>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const signInState = signInSelector(state);

    return {
        isAuthenticated: isAuthenticatedSelector(state),
        fetching: signInState.fetching,
        failed: signInState.signInFailed,
        validationResults: signInState.validationResults,
    };
};

export default withRouter(connect(mapStateToProps)(SignIn));
