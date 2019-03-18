import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getScopeName } from '@/config/scope';
import { TokenData, tokenSelector } from '@/state/auth';
import { RootState } from '@/state/rootReducer';
import { Date } from '@/ui/controls';

type Props = {
    tokenData: TokenData;
};

class IdentityStatusComponent extends Component<Props> {
    render() {
        const { tokenData } = this.props;

        return (
            <div>
                <div>
                    <b>Id:</b>&nbsp;
                    {
                        tokenData[
                            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                        ]
                    }
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
                    {getScopeName(tokenData.scope)}
                </div>
                <div>
                    <b>Roles:</b>&nbsp;
                    {tokenData[
                        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                    ].join(", ")}
                </div>
                <div>
                    <b>Token Expires:</b>&nbsp;
                    <Date
                        date={tokenData.exp}
                        includeTime={true}
                        isUnixSeconds={true}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const tokenState = tokenSelector(state);

    return {
        tokenData: tokenState.tokenData,
    };
};

const IdentityStatus = connect(mapStateToProps)(IdentityStatusComponent);

export { IdentityStatus };
