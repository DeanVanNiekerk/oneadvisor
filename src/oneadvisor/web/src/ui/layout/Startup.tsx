import React, { useEffect } from "react";
import { FullStoryAPI } from "react-fullstory";
import { connect, DispatchProp } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { AnyAction, bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";

import config from "@/config/config";
import { RootState } from "@/state";
import { isAuthenticatedSelector, roleSelector, tokenDataSelector } from "@/state/auth";
import { fetchAppInfo } from "@/state/context/actions";
import { Loader } from "@/ui/controls";

type Props = {
    children: React.ReactNode;
} & PropsFromState &
    PropsFromDispatch &
    RouteComponentProps &
    DispatchProp;

const Startup: React.FC<Props> = (props: Props) => {
    useEffect(() => {
        props.fetchAppInfo();
    }, []);

    useEffect(() => {
        if (props.isAuthenticated) {
            const loadUsersSimple = async () => {
                //Load users
                const fetchUsersSimple = await import(
                    "@/state/directory/usersSimple/list/actions"
                ).then((actionsModule) => actionsModule.fetchUsersSimple);
                props.dispatch(fetchUsersSimple());
            };

            const loadBranchesSimple = async () => {
                //Load users
                const fetchBranchesSimple = await import(
                    "@/state/directory/branchesSimple/list/actions"
                ).then((actionsModule) => actionsModule.fetchBranchesSimple);
                props.dispatch(fetchBranchesSimple());
            };

            const loadCommonData = () => {
                loadUsersSimple();
                loadBranchesSimple();
            };

            loadCommonData();

            const { tokenData, roles } = props;
            if (tokenData) {
                FullStoryAPI("identify", tokenData.nameid, {
                    displayName: `${tokenData.firstName} ${tokenData.lastName}`,
                    userName: tokenData.userName,
                    email: tokenData.email,
                    organisation: tokenData.organisationName,
                    branch: tokenData.branchName,
                    scope: tokenData.scope,
                    tokenExpiry: tokenData.exp,
                    roles: roles.join(", "),
                    environment: config.environment,
                });
            }
        }
    }, [props.isAuthenticated]);

    const isAccountPage = () => {
        return props.location.pathname === "/signin";
    };

    if (props.loading && !isAccountPage())
        return <Loader text="loading application..." size="large" />;

    return <>{props.children}</>;
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        loading: false,
        isAuthenticated: isAuthenticatedSelector(state),
        tokenData: tokenDataSelector(state),
        roles: roleSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        ...bindActionCreators(
            {
                fetchAppInfo,
            },
            dispatch
        ),
        dispatch,
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Startup));
