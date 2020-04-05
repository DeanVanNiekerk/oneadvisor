import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { RootState } from "@/state";
import {
    adviceScopeSelector,
    adviceScopeVisible,
    confirmCancelAdviceScope,
    saveAdviceScope,
} from "@/state/directory/lookups";
import { EditDrawer } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";

import AdviceScopeForm from "./AdviceScopeForm";
import EditAdviceScopeTitle from "./EditAdviceScopeTitle";

type Props = {
    onSaved?: () => void;
} & PropsFromState &
    PropsFromDispatch;

const EditAdviceScope: React.FC<Props> = (props: Props) => {
    const close = () => props.setVisible(false);

    return (
        <EditDrawer
            title={<EditAdviceScopeTitle />}
            iconName="database"
            visible={props.visible}
            updating={props.updating}
            onClose={() => {
                props.confirmCancel(close);
            }}
            onSave={() => {
                props.saveAdviceScope(props.onSaved);
            }}
        >
            <AdviceScopeForm />
        </EditDrawer>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const adviceScopeState = adviceScopeSelector(state);
    return {
        visible: adviceScopeState.visible,
        updating: adviceScopeState.updating,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        confirmCancel: (onCancelled: () => void) => {
            dispatch(confirmCancelAdviceScope(showConfirm, onCancelled));
        },
        saveAdviceScope: (onSaved?: () => void) => {
            dispatch(
                saveAdviceScope(() => {
                    if (onSaved) onSaved();
                    dispatch(adviceScopeVisible(false));
                })
            );
        },
        setVisible: (visible: boolean) => {
            dispatch(adviceScopeVisible(visible));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditAdviceScope);
