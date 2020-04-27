import React from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { policyTypesSelector } from "@/state/lookups/client";
import { PolicyType } from "@/state/lookups/client/policyTypes/types";

type Props = {
    policyTypes: PolicyType[];
    policyTypeId: string;
};

const PolicyTypeNameComponent: React.FC<Props> = (props: Props) => {
    const { policyTypes, policyTypeId } = props;

    const policyType = policyTypes.find((u) => u.id === policyTypeId);

    if (!policyType) return <span />;

    return <span>{policyType.name}</span>;
};

const mapStateToProps = (state: RootState) => {
    const policyTypesState = policyTypesSelector(state);

    return {
        policyTypes: policyTypesState.items,
    };
};

const PolicyTypeName = connect(mapStateToProps)(PolicyTypeNameComponent);

export { PolicyTypeName };
