import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { RootState } from "@/state";
import {
    adviceServiceSelector,
    adviceServiceVisible,
    confirmCancelAdviceService,
    saveAdviceService,
} from "@/state/lookups/directory";
import { EditDrawer } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";

import AdviceServiceForm from "./AdviceServiceForm";
import EditAdviceServiceTitle from "./EditAdviceServiceTitle";

type Props = {
    onSaved?: () => void;
} & PropsFromState &
    PropsFromDispatch;

const EditAdviceService: React.FC<Props> = (props: Props) => {
    const close = () => props.setVisible(false);

    return (
        <EditDrawer
            title={<EditAdviceServiceTitle />}
            iconName="database"
            visible={props.visible}
            updating={props.updating}
            onClose={() => {
                props.confirmCancel(close);
            }}
            onSave={() => {
                props.saveAdviceService(props.onSaved);
            }}
        >
            <AdviceServiceForm />
        </EditDrawer>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const adviceServiceState = adviceServiceSelector(state);
    return {
        visible: adviceServiceState.visible,
        updating: adviceServiceState.updating,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        confirmCancel: (onCancelled: () => void) => {
            dispatch(confirmCancelAdviceService(showConfirm, onCancelled));
        },
        saveAdviceService: (onSaved?: () => void) => {
            dispatch(
                saveAdviceService(() => {
                    if (onSaved) onSaved();
                    dispatch(adviceServiceVisible(false));
                })
            );
        },
        setVisible: (visible: boolean) => {
            dispatch(adviceServiceVisible(visible));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditAdviceService);
