import { Modal } from "antd";
import dayjs from "dayjs";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";
import { RouteComponentProps, RouteProps, withRouter } from "react-router";
import { Redirect, Route } from "react-router-dom";

import { RootState } from "@/state";
import { isAuthenticatedSelector, signOut, tokenDataSelector } from "@/state/auth";
import { TokenData } from "@/state/auth/types";

import Layout from "./Layout";

type Props = {
    isAuthenticated: boolean;
    tokenData: TokenData;
} & RouteComponentProps &
    DispatchProp &
    RouteProps;

class SecureRoute extends Component<Props> {
    private modalSet = false;
    private interval: NodeJS.Timeout;

    componentDidMount() {
        this.checkTokenExpired();
        this.interval = setInterval(this.checkTokenExpired, 10000); //Every 10 secs
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    checkTokenExpired = () => {
        if (!this.props.tokenData) return;

        const expiryDate = dayjs.unix(this.props.tokenData.exp);
        const hasExpired = dayjs().isAfter(expiryDate);

        if (hasExpired && !this.modalSet) {
            this.modalSet = true;
            this.props.dispatch(signOut());
            Modal.destroyAll();
            Modal.info({
                title: "Session has Expired",
                content: (
                    <div>
                        <p>Your session has expired, please click OK to sign in again</p>
                    </div>
                ),
                onOk: () => {
                    this.props.history.push("/signin");
                },
            });
        }
    };

    render() {
        if (!this.props.isAuthenticated) return <Redirect to="/signin" />;

        return (
            <Layout>
                <Route {...this.props} />
            </Layout>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const tokenData = tokenDataSelector(state);
    return {
        isAuthenticated: isAuthenticatedSelector(state),
        tokenData: tokenData,
    };
};

export default withRouter(connect(mapStateToProps)(SecureRoute));
