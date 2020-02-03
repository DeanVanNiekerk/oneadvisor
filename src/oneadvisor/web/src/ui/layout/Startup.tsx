import React, { useEffect } from "react";
import { FullStoryAPI } from "react-fullstory";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { AnyAction, bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";

import config from "@/config/config";
import { fetchAllClientLookups } from "@/state/app/client/lookups";
import { fetchAllCommissionLookups } from "@/state/app/commission/lookups";
import { fetchBranchesSimple } from "@/state/app/directory/branchesSimple";
import { fetchAllDirectoryLookups } from "@/state/app/directory/lookups";
import { fetchUsersSimple } from "@/state/app/directory/usersSimple";
import { isLoadingLookupsSelector } from "@/state/app/selectors";
import { isAuthenticatedSelector, tokenDataSelector } from "@/state/auth";
import { fetchAppInfo } from "@/state/context/actions";
import { RootState } from "@/state/rootReducer";
import { Loader } from "@/ui/controls";

type Props = {
    children: React.ReactNode;
} & PropsFromState &
    PropsFromDispatch &
    RouteComponentProps;

const Startup: React.FC<Props> = (props: Props) => {
    useEffect(() => {
        props.fetchAllDirectoryLookups();
        props.fetchAllCommissionLookups();
        props.fetchAllClientLookups();

        props.fetchAppInfo();
    }, []);

    useEffect(() => {
        if (props.isAuthenticated) {
            props.fetchUsersSimple();
            props.fetchBranchesSimple();

            const { tokenData } = props;
            if (tokenData) {
                FullStoryAPI(
                    "identify",
                    tokenData[
                        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                    ],
                    {
                        displayName: `${tokenData.firstName} ${tokenData.lastName}`,
                        userName: tokenData.userName,
                        email: tokenData.email,
                        organisation: tokenData.organisationName,
                        branch: tokenData.branchName,
                        scope: tokenData.scope,
                        tokenExpiry: tokenData.exp,
                        roles: tokenData[
                            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                        ].join(", "),
                        environment: config.environment,
                    }
                );
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
        loading: isLoadingLookupsSelector(state),
        isAuthenticated: isAuthenticatedSelector(state),
        tokenData: tokenDataSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        ...bindActionCreators(
            {
                fetchAllDirectoryLookups,
                fetchAllCommissionLookups,
                fetchAllClientLookups,
                fetchAppInfo,
                fetchUsersSimple,
                fetchBranchesSimple,
            },
            dispatch
        ),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Startup));
