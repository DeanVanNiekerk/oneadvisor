import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getScopeName } from '@/config/scope';
import { authSelector, Identity } from '@/state/auth';
import { RootState } from '@/state/rootReducer';
import { Date } from '@/ui/controls';

type Props = {
    identity: Identity;
};

class IdentityStatusComponent extends Component<Props> {
    render() {
        const { identity } = this.props;

        return (
            <div>
                <div>
                    <b>Id:</b>&nbsp;
                    {identity.userId}
                </div>
                <div>
                    <b>Name:</b>&nbsp;
                    {`${identity.firstName} ${identity.lastName}`}
                </div>
                <div>
                    <b>Email:</b>&nbsp;
                    {identity.email}
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
                    {identity.roles.join(', ')}
                </div>
                {/* <div>
                    <b>Token Expires:</b>&nbsp;
                    <Date
                        date={idTokenData.exp}
                        includeTime={true}
                        isUnixSeconds={true}
                    />
                </div> */}
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const identityState = authSelector(state);

    return {
        identity: identityState.identity
    };
};

const IdentityStatus = connect(mapStateToProps)(IdentityStatusComponent);

export { IdentityStatus };
