import React from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { policyProductTypesSelector } from "@/state/lookups/client";
import { PolicyProductType } from "@/state/lookups/client/policyProductTypes/types";

type Props = {
    policyProductTypes: PolicyProductType[];
    policyProductTypeId: string;
};

const PolicyProductTypeNameComponent: React.FC<Props> = (props: Props) => {
    const { policyProductTypes, policyProductTypeId } = props;

    const policyProductType = policyProductTypes.find((u) => u.id === policyProductTypeId);

    if (!policyProductType) return <span />;

    return <span>{policyProductType.name}</span>;
};

const mapStateToProps = (state: RootState) => {
    const policyProductTypesState = policyProductTypesSelector(state);

    return {
        policyProductTypes: policyProductTypesState.items,
    };
};

const PolicyProductTypeName = connect(mapStateToProps)(PolicyProductTypeNameComponent);

export { PolicyProductTypeName };
