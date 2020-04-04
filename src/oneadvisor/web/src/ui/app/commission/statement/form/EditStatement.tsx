import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { RootState } from "@/state";
import {
    confirmCancelStatement,
    saveStatement,
    statementIsLoadingSelector,
    statementSelector,
    statementVisible,
} from "@/state/commission/statements";
import { EditDrawer } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";

import EditStatementTitle from "./EditStatementTitle";
import StatementForm from "./StatementForm";

type Props = {
    onSaved?: () => void;
} & PropsFromState &
    PropsFromDispatch;

const EditStatement: React.FC<Props> = (props: Props) => {
    const close = () => props.setVisible(false);

    return (
        <EditDrawer
            title={<EditStatementTitle />}
            iconName="database"
            visible={props.visible}
            updating={props.loading}
            saveRequiredUseCase="com_edit_commission_statements"
            onClose={() => {
                props.confirmCancel(close);
            }}
            onSave={() => {
                props.saveStatement(props.onSaved);
            }}
        >
            <StatementForm />
        </EditDrawer>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const statementState = statementSelector(state);
    return {
        visible: statementState.visible,
        loading: statementIsLoadingSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        confirmCancel: (onCancelled: () => void) => {
            dispatch(confirmCancelStatement(showConfirm, onCancelled));
        },
        saveStatement: (onSaved?: () => void) => {
            dispatch(
                saveStatement(() => {
                    if (onSaved) onSaved();
                    dispatch(statementVisible(false));
                })
            );
        },
        setVisible: (visible: boolean) => {
            dispatch(statementVisible(visible));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditStatement);
