import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import {
    commissionSelector,
    commissionVisible,
    confirmCancelCommission,
    saveCommission,
} from "@/state/commission/commissions";
import { RootState } from "@/state/rootReducer";
import { EditDrawer } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";

import EditCommissionTitle from "./EditCommissionTitle";
import CommissionForm from "./form/CommissionForm";

type Props = {
    onSaved?: () => void;
} & PropsFromState &
    PropsFromDispatch;

const EditCommission: React.FC<Props> = (props: Props) => {
    const close = () => props.setVisible(false);

    return (
        <EditDrawer
            title={<EditCommissionTitle />}
            iconName="dollar"
            visible={props.visible}
            updating={props.updating}
            noTopPadding={true}
            saveRequiredUseCase="com_edit_commissions"
            onClose={() => {
                props.confirmCancel(close);
            }}
            onSave={() => {
                props.saveCommission(props.onSaved);
            }}
        >
            <CommissionForm />
        </EditDrawer>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const commissionState = commissionSelector(state);
    return {
        visible: commissionState.visible,
        updating: commissionState.updating,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        confirmCancel: (onCancelled: () => void) => {
            dispatch(confirmCancelCommission(showConfirm, onCancelled));
        },
        saveCommission: (onSaved?: () => void) => {
            dispatch(
                saveCommission(() => {
                    if (onSaved) onSaved();
                    dispatch(commissionVisible(false));
                })
            );
        },
        setVisible: (visible: boolean) => {
            dispatch(commissionVisible(visible));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditCommission);
