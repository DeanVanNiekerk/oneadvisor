import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getScopeName } from '@/config/scope';
import { Identity, identitySelector } from '@/state/app/directory/identity';
import { IdTokenData, idTokenDataSelector, UserInfo, userInfoSelector } from '@/state/auth';
import { RootState } from '@/state/rootReducer';
import { Date } from '@/ui/controls';

type Props = {
    identity: Identity;
    userInfo: UserInfo;
    idTokenData: IdTokenData;
};

class IdentityStatusComponent extends Component<Props> {
    render() {
        const { identity, userInfo, idTokenData } = this.props;

        return (
            <div>
                <div>
                    <b>Id:</b>&nbsp;
                    {identity.id}
                </div>
                <div>
                    <b>Name:</b>&nbsp;
                    {userInfo.name}
                </div>
                <div>
                    <b>Email:</b>&nbsp;
                    {userInfo.email}
                </div>
                <div>
                    <b>Organisation:</b>&nbsp;
                    {identity.organisationName}
                </div>
                <div>
                    <b>Branch:</b>&nbsp;
                    {identity.branchName}
                </div>
                <div>
                    <b>Scope:</b>&nbsp;
                    {getScopeName(identity.scope)}
                </div>
                <div>
                    <b>Roles:</b>&nbsp;
                    {identity.roleIds.join(', ')}
                </div>
                <div>
                    <b>OKTA Signin:</b>&nbsp;
                    <Date
                        date={idTokenData.auth_time}
                        includeTime={true}
                        isUnixSeconds={true}
                    />
                </div>
                <div>
                    <b>Token Issued:</b>&nbsp;
                    <Date
                        date={idTokenData.iat}
                        includeTime={true}
                        isUnixSeconds={true}
                    />
                </div>
                <div>
                    <b>Token Expires:</b>&nbsp;
                    <Date
                        date={idTokenData.exp}
                        includeTime={true}
                        isUnixSeconds={true}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const identityState = identitySelector(state);

    return {
        identity: identityState.identity,
        userInfo: userInfoSelector(state),
        idTokenData: idTokenDataSelector(state)
    };
};

const IdentityStatus = connect(mapStateToProps)(IdentityStatusComponent);

export { IdentityStatus };
