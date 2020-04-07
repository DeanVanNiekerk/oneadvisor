import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { RootState } from "@/state";
import { confirmCancelUser, saveUser, userSelector, userVisible } from "@/state/directory/users";
import { EditDrawer } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";

import EditUserTitle from "./EditUserTitle";
import UserForm from "./form/UserForm";

type Props = {
    onSaved?: () => void;
} & PropsFromState &
    PropsFromDispatch;

const EditUser: React.FC<Props> = (props: Props) => {
    const close = () => props.setVisible(false);

    return (
        <EditDrawer
            title={<EditUserTitle />}
            iconName="user"
            visible={props.visible}
            updating={props.updating}
            noTopPadding={true}
            onClose={() => {
                props.confirmCancel(close);
            }}
            onSave={() => {
                props.saveUser(props.onSaved);
            }}
        >
            <UserForm />
        </EditDrawer>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const userState = userSelector(state);
    return {
        visible: userState.visible,
        updating: userState.updating,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        confirmCancel: (onCancelled: () => void) => {
            dispatch(confirmCancelUser(showConfirm, onCancelled));
        },
        saveUser: (onSaved?: () => void) => {
            dispatch(
                saveUser(() => {
                    if (onSaved) onSaved();
                    dispatch(userVisible(false));
                })
            );
        },
        setVisible: (visible: boolean) => {
            dispatch(userVisible(visible));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditUser);
