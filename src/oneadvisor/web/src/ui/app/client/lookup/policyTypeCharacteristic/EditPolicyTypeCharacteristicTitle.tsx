import React from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { policyTypeCharacteristicSelector } from "@/state/lookups/client";

type Props = PropsFromState;

const EditPolicyTypeCharacteristicTitle: React.FC<Props> = ({ policyTypeCharacteristic }) => {
    return (
        <>
            {policyTypeCharacteristic && policyTypeCharacteristic.id
                ? `Policy Type Characteristic: ${policyTypeCharacteristic.name}`
                : "New Policy Type Characteristic"}
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: RootState) => ({
    policyTypeCharacteristic: policyTypeCharacteristicSelector(state).policyTypeCharacteristic,
});

export default connect(mapStateToProps)(EditPolicyTypeCharacteristicTitle);
