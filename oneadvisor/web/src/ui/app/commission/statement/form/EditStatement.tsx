import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import {
    confirmCancelStatement,
    saveStatement,
    statementIsLoadingSelector,
    statementSelector,
    statementVisible,
} from "@/state/app/commission/statements";
import { RootState } from "@/state/rootReducer";
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
            icon="database"
            visible={props.visible}
            updating={props.loading}
            noTopPadding={true}
            saveRequiredUseCase="com_edit_commission_statements"
            onClose={() => {
                props.confirmCancel(close);
            }}
            onSave={() => {
                props.saveStatement(props.onSaved);
                close();
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
            dispatch(saveStatement(onSaved));
        },
        setVisible: (visible: boolean) => {
            dispatch(statementVisible(visible));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditStatement);
