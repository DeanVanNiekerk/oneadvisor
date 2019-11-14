import React, { useEffect } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { AnyAction, bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { fetchAllClientLookups } from "@/state/app/client/lookups";
import { fetchAllCommissionLookups } from "@/state/app/commission/lookups";
import { fetchAllDirectoryLookups } from "@/state/app/directory/lookups";
import { isLoadingLookupsSelector } from "@/state/app/selectors";
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
            },
            dispatch
        ),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Startup));
