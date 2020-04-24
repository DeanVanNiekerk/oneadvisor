import { ThunkAction } from "redux-thunk";

import { ApiAction, ApiOnSuccess, ShowConfirm } from "@/app/types";
import { ValidationResult } from "@/app/validation";
import { licenseCategoriesApi } from "@/config/api/directory";
import { RootState } from "@/state";

import { licenseCategoryIsModifiedSelector, licenseCategorySelector } from "../";
import { LicenseCategoryEdit } from "../types";

type LicenseCategoryReceiveAction = {
    type: "LICENSECATEGORIES_LICENSECATEGORY_RECEIVE";
    payload: LicenseCategoryEdit | null;
};
type LicenseCategoryModifiedAction = {
    type: "LICENSECATEGORIES_LICENSECATEGORY_MODIFIED";
    payload: LicenseCategoryEdit;
};
type LicenseCategoryVisibleAction = {
    type: "LICENSECATEGORIES_LICENSECATEGORY_VISIBLE";
    payload: boolean;
};
type LicenseCategoryUpdatedAction = {
    type: "LICENSECATEGORIES_LICENSECATEGORY_EDIT_RECEIVE";
};
type LicenseCategoryUpdatingAction = {
    type: "LICENSECATEGORIES_LICENSECATEGORY_EDIT_FETCHING";
};
type LicenseCategoryUpdatingErrorAction = {
    type: "LICENSECATEGORIES_LICENSECATEGORY_EDIT_FETCHING_ERROR";
};
type LicenseCategoryValidationErrorAction = {
    type: "LICENSECATEGORIES_LICENSECATEGORY_EDIT_VALIDATION_ERROR";
    payload: ValidationResult[];
};

export type LicenseCategoryAction =
    | LicenseCategoryModifiedAction
    | LicenseCategoryVisibleAction
    | LicenseCategoryReceiveAction
    | LicenseCategoryUpdatedAction
    | LicenseCategoryUpdatingAction
    | LicenseCategoryUpdatingErrorAction
    | LicenseCategoryValidationErrorAction;

export const receiveLicenseCategory = (
    licenseCategory: LicenseCategoryEdit | null
): LicenseCategoryReceiveAction => ({
    type: "LICENSECATEGORIES_LICENSECATEGORY_RECEIVE",
    payload: licenseCategory,
});

export const modifyLicenseCategory = (
    licenseCategory: LicenseCategoryEdit
): LicenseCategoryModifiedAction => ({
    type: "LICENSECATEGORIES_LICENSECATEGORY_MODIFIED",
    payload: licenseCategory,
});

export const licenseCategoryVisible = (visible: boolean): LicenseCategoryVisibleAction => ({
    type: "LICENSECATEGORIES_LICENSECATEGORY_VISIBLE",
    payload: visible,
});

export const clearLicenseCategory = (): LicenseCategoryReceiveAction =>
    receiveLicenseCategory(null);

export const newLicenseCategory = (): LicenseCategoryReceiveAction => {
    const licenseCategory: LicenseCategoryEdit = {
        id: null,
        code: "",
        name: "",
    };

    return receiveLicenseCategory(licenseCategory);
};

export const saveLicenseCategory = (
    onSaved?: () => void
): ThunkAction<void, RootState, {}, LicenseCategoryReceiveAction | ApiAction> => {
    return (dispatch, getState) => {
        const { licenseCategory } = licenseCategorySelector(getState());
        if (!licenseCategory) return;

        const onSuccess = () => {
            dispatch(clearLicenseCategory());
            if (onSaved) onSaved();
        };

        if (licenseCategory.id) {
            dispatch(updateLicenseCategory(licenseCategory, onSuccess));
        } else {
            dispatch(insertLicenseCategory(licenseCategory, onSuccess));
        }
    };
};

export const confirmCancelLicenseCategory = (
    showConfirm: ShowConfirm,
    onCancelled: () => void
): ThunkAction<void, RootState, {}, LicenseCategoryReceiveAction> => {
    return (dispatch, getState) => {
        const modifed = licenseCategoryIsModifiedSelector(getState());

        const cancel = () => {
            dispatch(clearLicenseCategory());
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

export const updateLicenseCategory = (
    licenseCategory: LicenseCategoryEdit,
    onSuccess?: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${licenseCategoriesApi}/${licenseCategory.id}`,
    method: "POST",
    payload: licenseCategory,
    onSuccess: onSuccess,
    dispatchPrefix: "LICENSECATEGORIES_LICENSECATEGORY_EDIT",
});

export const insertLicenseCategory = (
    licenseCategory: LicenseCategoryEdit,
    onSuccess?: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${licenseCategoriesApi}`,
    method: "POST",
    payload: licenseCategory,
    onSuccess: onSuccess,
    dispatchPrefix: "LICENSECATEGORIES_LICENSECATEGORY_EDIT",
});
