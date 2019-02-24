import { Col, Form, Icon, Row } from 'antd';
import { string } from 'prop-types';
import React, { ReactNode } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import styled from 'styled-components';

import { ValidationResult } from '@/app/validation';
import { authSelector, Credentials, signIn } from '@/state/auth';
import { RootState } from '@/state/rootReducer';
import { Button, FormField, FormInput, Loader } from '@/ui/controls';

const Header = styled.div`
    font-size: 32px;
    text-align: center;
`;

const Light = styled.span`
    font-weight: 100;
`;

const Bold = styled.span`
    font-weight: 600;
`;

type Props = {
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
            userName: '',
            password: ''
        };
    }

    handleUserNameChange = (fieldName: string, value: any) => {
        this.setState({
            userName: value
        });
    };

    handlePasswordChange = (fieldName: string, value: any) => {
        this.setState({
            password: value
        });
    };

    signIn = () => {
        const credentials: Credentials = {
            userName: this.state.userName,
            password: this.state.password
        };
        this.props.dispatch(
            signIn(credentials, () => {
                this.props.history.push('/');
            })
        );
    };

    onKeyPress = event => {
        if (event.key === 'Enter') {
            this.signIn();
        }
    };

    render() {
        const { validationResults } = this.props;

        return (
            <>
                <Row type="flex" justify="center">
                    <Col span={4} style={{ marginTop: '80px' }}>
                        <Header className="mb-2">
                            <Light>ONE</Light>
                            <Bold>ADVISOR</Bold>
                        </Header>
                        <h3>Sign In</h3>
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
                                    marginBottom: '10px'
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
                                    marginBottom: '25px'
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
                    </Col>
                </Row>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const authState = authSelector(state);

    return {
        fetching: authState.fetching,
        failed: authState.signInFailed,
        validationResults: authState.validationResults
    };
};

export default connect(mapStateToProps)(SignIn);
