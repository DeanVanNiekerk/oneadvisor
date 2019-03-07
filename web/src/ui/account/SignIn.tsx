import { Col, Form, Icon, Row } from 'antd';
import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { ValidationResult } from '@/app/validation';
import { authSelector, Credentials, isAuthenticatedSelector, signIn } from '@/state/auth';
import { RootState } from '@/state/rootReducer';
import { Button, ContentLoader, FormField, FormInput } from '@/ui/controls';

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

    render() {
        const { validationResults } = this.props;

        return (
            <>
                <Row type="flex" justify="center">
                    <Col span={4} style={{ marginTop: "80px" }}>
                        <div
                            className="mb-2"
                            style={{
                                fontSize: "32px",
                                textAlign: "center",
                            }}
                        >
                            <span
                                style={{
                                    fontWeight: 100,
                                }}
                            >
                                ONE
                            </span>
                            <span
                                style={{
                                    fontWeight: 600,
                                }}
                            >
                                ADVISOR
                            </span>
                        </div>
                        <h3>Sign In</h3>
                        <ContentLoader isLoading={this.props.fetching}>
                            <Form layout="vertical">
                                <FormInput
                                    placeholder="Email"
                                    fieldName="userName"
                                    value={this.state.userName}
                                    size="large"
                                    prefix={<Icon type="user" />}
                                    onChange={this.handleUserNameChange}
                                    validationResults={validationResults}
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
                                    validationResults={validationResults}
                                    autoFocus={true}
                                    formFieldStyle={{
                                        marginBottom: "25px",
                                    }}
                                    type="password"
                                    onKeyPress={this.onKeyPress}
                                />

                                {this.props.failed && (
                                    <p className="text-error text-center mb-2">
                                        <b>Invalid email or password</b>
                                    </p>
                                )}

                                <FormField>
                                    <Button
                                        size="large"
                                        noLeftMargin={true}
                                        onClick={this.signIn}
                                        type="primary"
                                        block={true}
                                    >
                                        Sign In
                                    </Button>
                                </FormField>
                            </Form>
                        </ContentLoader>
                    </Col>
                </Row>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const authState = authSelector(state);

    return {
        isAuthenticated: isAuthenticatedSelector(state),
        fetching: authState.fetching,
        failed: authState.signInFailed,
        validationResults: authState.validationResults,
    };
};

export default withRouter(connect(mapStateToProps)(SignIn));
