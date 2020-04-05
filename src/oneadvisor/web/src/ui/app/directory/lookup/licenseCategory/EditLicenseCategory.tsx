import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { RootState } from "@/state";
import {
    confirmCancelLicenseCategory,
    licenseCategorySelector,
    licenseCategoryVisible,
    saveLicenseCategory,
} from "@/state/directory/lookups";
import { EditDrawer } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";

import EditLicenseCategoryTitle from "./EditLicenseCategoryTitle";
import LicenseCategoryForm from "./LicenseCategoryForm";

type Props = {
    onSaved?: () => void;
} & PropsFromState &
    PropsFromDispatch;

const EditLicenseCategory: React.FC<Props> = (props: Props) => {
    const close = () => props.setVisible(false);

    return (
        <EditDrawer
            title={<EditLicenseCategoryTitle />}
            iconName="database"
            visible={props.visible}
            updating={props.updating}
            onClose={() => {
                props.confirmCancel(close);
            }}
            onSave={() => {
                props.saveLicenseCategory(props.onSaved);
            }}
        >
            <LicenseCategoryForm />
        </EditDrawer>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const licenseCategoryState = licenseCategorySelector(state);
    return {
        visible: licenseCategoryState.visible,
        updating: licenseCategoryState.updating,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        confirmCancel: (onCancelled: () => void) => {
            dispatch(confirmCancelLicenseCategory(showConfirm, onCancelled));
        },
        saveLicenseCategory: (onSaved?: () => void) => {
            dispatch(
                saveLicenseCategory(() => {
                    if (onSaved) onSaved();
                    dispatch(licenseCategoryVisible(false));
                })
            );
        },
        setVisible: (visible: boolean) => {
            dispatch(licenseCategoryVisible(visible));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditLicenseCategory);
