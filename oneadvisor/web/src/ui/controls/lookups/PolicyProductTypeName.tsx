import React, { Component } from "react";
import { connect } from "react-redux";

import { PolicyProductType, policyProductTypesSelector } from "@/state/app/client/lookups";
import { RootState } from "@/state/rootReducer";

type Props = {
    policyProductTypes: PolicyProductType[];
    policyProductTypeId: string;
};

class PolicyProductTypeNameComponent extends Component<Props> {
    render() {
        const { policyProductTypes, policyProductTypeId } = this.props;

        const policyProductType = policyProductTypes.find(u => u.id === policyProductTypeId);

        if (!policyProductType) return <span />;

        return <span>{policyProductType.name}</span>;
    }
}

const mapStateToProps = (state: RootState) => {
    const policyProductTypesState = policyProductTypesSelector(state);

    return {
        policyProductTypes: policyProductTypesState.items,
    };
};

const PolicyProductTypeName = connect(mapStateToProps)(PolicyProductTypeNameComponent);

export { PolicyProductTypeName };
