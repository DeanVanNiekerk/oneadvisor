import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { RootState } from "@/state";
import {
    confirmCancelPolicyTypeCharacteristic,
    policyTypeCharacteristicSelector,
    policyTypeCharacteristicVisible,
    savePolicyTypeCharacteristic,
} from "@/state/lookups/client";
import { EditDrawer } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";

import EditPolicyTypeCharacteristicTitle from "./EditPolicyTypeCharacteristicTitle";
import PolicyTypeCharacteristicForm from "./PolicyTypeCharacteristicForm";

type Props = {
    onSaved?: () => void;
} & PropsFromState &
    PropsFromDispatch;

const EditPolicyTypeCharacteristic: React.FC<Props> = (props: Props) => {
    const close = () => props.setVisible(false);

    return (
        <EditDrawer
            title={<EditPolicyTypeCharacteristicTitle />}
            iconName="database"
            visible={props.visible}
            updating={props.updating}
            onClose={() => {
                props.confirmCancel(close);
            }}
            onSave={() => {
                props.savePolicyTypeCharacteristic(props.onSaved);
            }}
        >
            <PolicyTypeCharacteristicForm />
        </EditDrawer>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const policyTypeCharacteristicState = policyTypeCharacteristicSelector(state);
    return {
        visible: policyTypeCharacteristicState.visible,
        updating: policyTypeCharacteristicState.updating,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        confirmCancel: (onCancelled: () => void) => {
            dispatch(confirmCancelPolicyTypeCharacteristic(showConfirm, onCancelled));
        },
        savePolicyTypeCharacteristic: (onSaved?: () => void) => {
            dispatch(
                savePolicyTypeCharacteristic(() => {
                    if (onSaved) onSaved();
                    dispatch(policyTypeCharacteristicVisible(false));
                })
            );
        },
        setVisible: (visible: boolean) => {
            dispatch(policyTypeCharacteristicVisible(visible));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPolicyTypeCharacteristic);
