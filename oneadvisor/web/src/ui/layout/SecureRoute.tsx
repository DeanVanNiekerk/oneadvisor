import { Modal } from "antd";
import moment from "moment";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";
import { RouteComponentProps, RouteProps, withRouter } from "react-router";
import { Redirect, Route } from "react-router-dom";

import { isAuthenticatedSelector, signOut, TokenData, tokenSelector } from "@/state/auth";
import { RootState } from "@/state/rootReducer";

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

        const expiryDate = moment.unix(this.props.tokenData.exp);
        const hasExpired = moment().isAfter(expiryDate);

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
    const tokenState = tokenSelector(state);
    return {
        isAuthenticated: isAuthenticatedSelector(state),
        tokenData: tokenState.tokenData,
    };
};

export default withRouter(connect(mapStateToProps)(SecureRoute));
