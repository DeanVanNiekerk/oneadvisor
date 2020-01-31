import React from "react";
import { connect } from "react-redux";

import { tokenSelector } from "@/state/auth";
import { contextSelector } from "@/state/context/selectors";
import { RootState } from "@/state/rootReducer";
import { Date } from "@/ui/controls";

type Props = PropsFromState;

const IdentityStatusComponent: React.FC<Props> = ({ tokenData, appInfo }) => {
    if (!tokenData) return <React.Fragment />;

    return (
        <div>
            <div>
                <b>Id:</b>&nbsp;
                {tokenData.nameid}
            </div>
            <div>
                <b>Name:</b>&nbsp;
                {`${tokenData.firstName} ${tokenData.lastName}`}
            </div>
            <div>
                <b>Username:</b>&nbsp;
                {tokenData.userName}
            </div>
            <div>
                <b>Email:</b>&nbsp;
                {tokenData.email}
            </div>
            <div>
                <b>Organisation:</b>&nbsp;
                {tokenData.organisationName}
            </div>
            <div>
                <b>Branch:</b>&nbsp;
                {tokenData.branchName}
            </div>
            <div>
                <b>Scope:</b>&nbsp;
                {tokenData.scope}
            </div>
            <div>
                <b>Roles:</b>&nbsp;
                {tokenData.roles.join(", ")}
            </div>
            <div>
                <b>Token Expires:</b>&nbsp;
                <Date date={tokenData.exp} includeTime={true} isUnixSeconds={true} />
            </div>
            <div>
                <b>App Version:</b>&nbsp;
                {appInfo && appInfo.version}
            </div>
        </div>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const tokenState = tokenSelector(state);
    const contextState = contextSelector(state);

    return {
        tokenData: tokenState.tokenData,
        appInfo: contextState.appInfo,
    };
};

const IdentityStatus = connect(mapStateToProps)(IdentityStatusComponent);

export { IdentityStatus };
