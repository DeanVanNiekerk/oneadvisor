import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import {
    confirmCancelPolicy, PolicyEdit, policyIsLoadingSelector, policySelector, policyVisible, savePolicy
} from "@/state/app/client/policies";
import { RootState } from "@/state/rootReducer";
import { EditDrawer } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";

import EditPolicyTitle from "./EditPolicyTitle";
import PolicyForm from "./PolicyForm";

type Props = {
    onSaved?: (policy: PolicyEdit) => void;
} & PropsFromState &
    PropsFromDispatch;

const EditPolicy: React.FC<Props> = (props: Props) => {

    const close = () => props.setVisible(false);

    return (
        <EditDrawer
            title={<EditPolicyTitle />}
            icon="file-text"
            visible={props.visible}
            updating={props.loading}
            saveRequiredUseCase="clt_edit_policies"
            onClose={() => {
                props.confirmCancel(close);
            }}
            onSave={() => {
                props.savePolicy(props.onSaved);
            }}
        >
            <PolicyForm />
        </EditDrawer>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const policyState = policySelector(state);
    return {
        loading: policyIsLoadingSelector(state),
        visible: policyState.visible,
        policyTypeId: policyState.policy ? policyState.policy.policyTypeId : "",
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        confirmCancel: (onCancelled: () => void) => {
            dispatch(confirmCancelPolicy(showConfirm, onCancelled));
        },
        savePolicy: (onSaved?: (policy: PolicyEdit) => void) => {
            dispatch(savePolicy((policy: PolicyEdit) => {
                if (onSaved) onSaved(policy);
                dispatch(policyVisible(false));
            }));
        },
        setVisible: (visible: boolean) => {
            dispatch(policyVisible(visible));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditPolicy);
