import update from "immutability-helper";
import { ThunkAction } from "redux-thunk";

import { ApiAction, ShowConfirm } from "@/app/types";
import { RootState } from "@/state";

import {
    insertOrganisation,
    modifyOrganisation,
    organisationIsModifiedSelector,
    OrganisationModifiedAction,
    OrganisationReceiveAction,
    organisationSelector,
    receiveOrganisation,
    updateOrganisation,
} from "../";
import { Address, Branding, ComplianceOfficer, Config, OrganisationEdit } from "../types";

export const modifyOrganisationConfig = (
    config: Config
): ThunkAction<void, RootState, {}, OrganisationModifiedAction> => {
    return (dispatch, getState) => {
        const { organisation } = organisationSelector(getState());
        if (!organisation) return;

        const organisationModified = update(organisation, {
            config: { $set: config },
        });

        dispatch(modifyOrganisation(organisationModified));
    };
};

export const modifyOrganisationConfigAddress = (
    address: Address
): ThunkAction<void, RootState, {}, OrganisationModifiedAction> => {
    return (dispatch, getState) => {
        const { organisation } = organisationSelector(getState());
        if (!organisation) return;

        const organisationModified = update(organisation, {
            config: { address: { $set: address } },
        });

        dispatch(modifyOrganisation(organisationModified));
    };
};

export const modifyOrganisationConfigComplianceOfficer = (
    complianceOfficer: ComplianceOfficer
): ThunkAction<void, RootState, {}, OrganisationModifiedAction> => {
    return (dispatch, getState) => {
        const { organisation } = organisationSelector(getState());
        if (!organisation) return;

        const organisationModified = update(organisation, {
            config: { complianceOfficer: { $set: complianceOfficer } },
        });

        dispatch(modifyOrganisation(organisationModified));
    };
};

export const modifyOrganisationConfigBranding = (
    branding: Branding
): ThunkAction<void, RootState, {}, OrganisationModifiedAction> => {
    return (dispatch, getState) => {
        const { organisation } = organisationSelector(getState());
        if (!organisation) return;

        const organisationModified = update(organisation, {
            config: { branding: { $set: branding } },
        });

        dispatch(modifyOrganisation(organisationModified));
    };
};

export const clearOrganisation = (): OrganisationReceiveAction => receiveOrganisation(null);

export const saveOrganisation = (
    onSaved?: (organisation: OrganisationEdit) => void
): ThunkAction<void, RootState, {}, OrganisationReceiveAction | ApiAction> => {
    return (dispatch, getState) => {
        const { organisation } = organisationSelector(getState());
        if (!organisation) return;

        const onSuccess = (organisationEdit: OrganisationEdit) => {
            dispatch(clearOrganisation());
            if (onSaved) onSaved(organisationEdit);
        };

        if (organisation.id) {
            dispatch(
                updateOrganisation(organisation, () => {
                    onSuccess(organisation);
                })
            );
        } else {
            dispatch(
                insertOrganisation(organisation, (result) => {
                    onSuccess(result.tag);
                })
            );
        }
    };
};

export const confirmCancelOrganisation = (
    showConfirm: ShowConfirm,
    onCancelled: () => void
): ThunkAction<void, RootState, {}, OrganisationReceiveAction> => {
    return (dispatch, getState) => {
        const modifed = organisationIsModifiedSelector(getState());

        const cancel = () => {
            dispatch(clearOrganisation());
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
