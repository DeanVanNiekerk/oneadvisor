import update from "immutability-helper";
import { ThunkAction } from "redux-thunk";

import { ApiAction, ShowConfirm } from "@/app/types";
import { RootState } from "@/state";

import {
    insertUser,
    modifyUser,
    receiveUser,
    updateUser,
    userIsModifiedSelector,
    UserModifiedAction,
    UserReceiveAction,
    userSelector,
} from "../";
import { Config, UserEdit } from "../types";

export const clearUser = (): UserReceiveAction => receiveUser(null);

export const modifyUserConfig = (
    config: Config
): ThunkAction<void, RootState, {}, UserModifiedAction> => {
    return (dispatch, getState) => {
        const { user } = userSelector(getState());
        if (!user) return;

        const userModified = update(user, {
            config: { $set: config },
        });

        dispatch(modifyUser(userModified));
    };
};

export const saveUser = (
    onSaved?: (user: UserEdit) => void
): ThunkAction<void, RootState, {}, UserReceiveAction | ApiAction> => {
    return (dispatch, getState) => {
        const { user } = userSelector(getState());
        if (!user) return;

        const onSuccess = (userEdit: UserEdit) => {
            dispatch(clearUser());
            if (onSaved) onSaved(userEdit);
        };

        if (user.id) {
            dispatch(
                updateUser(user, () => {
                    onSuccess(user);
                })
            );
        } else {
            dispatch(
                insertUser(user, (result) => {
                    onSuccess(result.tag);
                })
            );
        }
    };
};

export const confirmCancelUser = (
    showConfirm: ShowConfirm,
    onCancelled: () => void
): ThunkAction<void, RootState, {}, UserReceiveAction> => {
    return (dispatch, getState) => {
        const modifed = userIsModifiedSelector(getState());

        const cancel = () => {
            dispatch(clearUser());
            onCancelled();
        };

        if (modifed)
            return showConfirm({
                onOk: () => {
                    cancel();
                },
            });

        cancel();
    };
};
