import React, { Component } from 'react';
import { connect } from 'react-redux';

import { PolicyType, policyTypesSelector } from '@/state/app/client/lookups';
import { RootState } from '@/state/rootReducer';

type Props = {
    policyTypes: PolicyType[];
    policyTypeId: string;
};

class PolicyTypeNameComponent extends Component<Props> {
    render() {
        const { policyTypes, policyTypeId } = this.props;

        const policyType = policyTypes.find(u => u.id === policyTypeId);

        if (!policyType) return <span />;

        return <span>{policyType.name}</span>;
    }
}

const mapStateToProps = (state: RootState) => {
    const policyTypesState = policyTypesSelector(state);

    return {
        policyTypes: policyTypesState.items,
    };
};

const PolicyTypeName = connect(mapStateToProps)(PolicyTypeNameComponent);

export { PolicyTypeName };
