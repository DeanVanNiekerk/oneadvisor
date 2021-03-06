import { Alert, Form } from "antd";
import React from "react";
import { connect, DispatchProp } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";

import { resetPasswordRequest, signOut } from "@/state/auth";
import { ResetPasswordRequestData } from "@/state/auth/types";
import { Button, FormField, FormInput } from "@/ui/controls";
import { UserOutlined } from "@ant-design/icons";

import Layout from "./Layout";

type Props = {} & DispatchProp & RouteComponentProps;

type State = {
    userName: string;
    emailSent: boolean;
    fetching: boolean;
};

class ResetPasswordRequest extends React.Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            userName: "",
            emailSent: false,
            fetching: false,
        };
    }

    componentDidMount() {
        this.props.dispatch(signOut());
    }

    handleUserNameChange = (fieldName: string, value: string) => {
        this.setState({
            userName: value,
        });
    };

    sendResetPasswordRequest = () => {
        this.setState({
            fetching: true,
        });
        const data: ResetPasswordRequestData = {
            userName: this.state.userName,
        };
        this.props.dispatch(
            resetPasswordRequest(
                data,
                () => {
                    this.setState({
                        emailSent: true,
                        fetching: false,
                    });
                },
                () => {
                    this.setState({
                        fetching: false,
                    });
                }
            )
        );
    };

    onKeyPress = (event) => {
        if (event.key === "Enter") {
            this.sendResetPasswordRequest();
        }
    };

    signIn = () => {
        this.props.history.push("/signin");
    };

    render() {
        return (
            <Layout header="Reset Password" loading={this.state.fetching}>
                {this.state.emailSent && (
                    <>
                        <Alert
                            message="If an account exists with the username you entered, we will email you instructions for resetting your password.
                            If you don't receive an email, please make sure you've entered the username you registered with."
                            type="info"
                            className="mb-1"
                        />

                        <Button
                            size="large"
                            noLeftMargin={true}
                            onClick={this.signIn}
                            type="primary"
                            block={true}
                        >
                            Sign In
                        </Button>
                    </>
                )}

                {!this.state.emailSent && (
                    <Form layout="vertical">
                        <FormInput
                            placeholder="Username"
                            fieldName="userName"
                            onChange={this.handleUserNameChange}
                            value={this.state.userName}
                            size="large"
                            prefix={<UserOutlined />}
                            formFieldStyle={{
                                marginBottom: "25px",
                            }}
                            autoFocus={true}
                        />

                        <FormField>
                            <Button
                                size="large"
                                noLeftMargin={true}
                                onClick={this.sendResetPasswordRequest}
                                type="primary"
                                block={true}
                            >
                                Submit
                            </Button>
                        </FormField>
                    </Form>
                )}
            </Layout>
        );
    }
}

export default withRouter(connect()(ResetPasswordRequest));
