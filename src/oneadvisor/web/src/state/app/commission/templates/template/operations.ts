import update from "immutability-helper";
import { ThunkAction } from "redux-thunk";

import {
    ApiAction,
    ApiOnFailure,
    ApiOnSuccess,
    Result,
    ShowConfirm,
    ShowMessage,
} from "@/app/types";
import { statementTemplatesApi } from "@/config/api/commission";
import { RootState } from "@/state/rootReducer";

import {
    commissionStatementTemplateIsModifiedSelector,
    commissionStatementTemplateSelector,
    modifyCommissionStatementTemplate,
    receiveCommissionStatementTemplate,
    TemplateModifiedAction,
    TemplateReceiveAction,
} from "../";
import {
    CommissionType,
    commissionTypesSelector,
    UNKNOWN_COMMISSION_TYPE_CODE,
} from "../../lookups";
import { CommissionStatementTemplateEdit, Config, Sheet } from "../types";

export const fetchCommissionStatementTemplate = (templateId: string): ApiAction => ({
    type: "API",
    endpoint: `${statementTemplatesApi}/${templateId}`,
    dispatchPrefix: "COMMISSIONS_STATEMENT_TEMPLATE",
});

export const clearCommissionStatementTemplate = (): TemplateReceiveAction =>
    receiveCommissionStatementTemplate(null);

export const newCommissionStatementTemplate = (): TemplateReceiveAction => {
    const template: CommissionStatementTemplateEdit = {
        id: "",
        name: "",
        companyId: "",
        startDate: "",
        endDate: "",
        config: {
            sheets: [
                {
                    position: 1,
                    config: {
                        headerIdentifier: {
                            column: "",
                            value: "",
                        },
                        fields: [],
                        commissionTypes: {
                            defaultCommissionTypeCode: UNKNOWN_COMMISSION_TYPE_CODE,
                            mappingTemplate: "",
                            types: [],
                        },
                        groups: [],
                    },
                },
            ],
        },
    };
    return receiveCommissionStatementTemplate(template);
};

export const saveCommissionStatementTemplate = (
    updateUnknownCommissionTypes: boolean,
    onSaved?: (template: CommissionStatementTemplateEdit) => void,
    onFailed?: () => void
): ThunkAction<void, RootState, {}, TemplateReceiveAction | ApiAction> => {
    return (dispatch, getState) => {
        const { template } = commissionStatementTemplateSelector(getState());
        if (!template) return;

        const onSuccess = (templateEdit: CommissionStatementTemplateEdit) => {
            dispatch(clearCommissionStatementTemplate());
            if (onSaved) onSaved(templateEdit);
        };

        if (template.id) {
            dispatch(
                updateCommissionStatementTemplate(
                    template,
                    updateUnknownCommissionTypes,
                    () => {
                        onSuccess(template);
                    },
                    onFailed
                )
            );
        } else {
            dispatch(
                insertCommissionStatementTemplate(
                    template,
                    result => {
                        onSuccess(result.tag);
                    },
                    onFailed
                )
            );
        }
    };
};

// save = (
//     updateUnknownCommissionTypes: boolean,
//     onSuccess?: ApiOnSuccess,
//     onFailure?: ApiOnFailure,
//     disableSuccessMessage?: boolean
// ) => {
//     if (!this.state.templateEdited) {
//         //this.close();
//         return;
//     }

//     if (this.state.templateEdited.id) {
//         this.props.dispatch(
//             updateCommissionStatementTemplate(
//                 this.state.templateEdited,
//                 updateUnknownCommissionTypes,
//                 (result, dispatch) => {
//                     if (!disableSuccessMessage) {
//                         showMessage("success", "Template Successfully Saved", 3);
//                     }
//                     this.props.dispatch(
//                         receiveCommissionStatementTemplate(this.state.templateEdited)
//                     );
//                     if (onSuccess) onSuccess(result, dispatch);
//                 },
//                 onFailure
//             )
//         );
//     } else {
//         this.props.dispatch(
//             insertCommissionStatementTemplate(
//                 this.state.templateEdited,
//                 (result, dispatch) => {
//                     this.close();
//                     if (onSuccess) onSuccess(result, dispatch);
//                 },
//                 onFailure
//             )
//         );
//     }
// };

export const confirmCancelCommissionStatementTemplate = (
    showConfirm: ShowConfirm,
    onCancelled: () => void
): ThunkAction<void, RootState, {}, TemplateReceiveAction> => {
    return (dispatch, getState) => {
        const modifed = commissionStatementTemplateIsModifiedSelector(getState());

        const cancel = () => {
            dispatch(clearCommissionStatementTemplate());
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

export const updateCommissionStatementTemplate = (
    template: CommissionStatementTemplateEdit,
    updateUnknownCommissionTypes: boolean,
    onSuccess?: ApiOnSuccess<Result<null>>,
    onFailure?: ApiOnFailure
): ApiAction => ({
    type: "API",
    endpoint: `${statementTemplatesApi}/${template.id}?updateUnknownCommissionTypes=${updateUnknownCommissionTypes}`,
    method: "POST",
    payload: template,
    onSuccess: onSuccess,
    onFailure: onFailure,
    dispatchPrefix: "COMMISSIONS_STATEMENT_TEMPLATE_EDIT",
});

export const insertCommissionStatementTemplate = (
    template: CommissionStatementTemplateEdit,
    onSuccess?: ApiOnSuccess<Result<CommissionStatementTemplateEdit>>,
    onFailure?: ApiOnFailure
): ApiAction => ({
    type: "API",
    endpoint: `${statementTemplatesApi}`,
    method: "POST",
    payload: template,
    onSuccess: onSuccess,
    onFailure: onFailure,
    dispatchPrefix: "COMMISSIONS_STATEMENT_TEMPLATE_EDIT",
});

export const commissionStatementTemplateOverride = (
    newConfig: string,
    showMessage: ShowMessage
): ThunkAction<void, RootState, {}, TemplateModifiedAction> => {
    return (dispatch, getState) => {
        const template = commissionStatementTemplateSelector(getState()).template;
        const commissionTypes = commissionTypesSelector(getState()).items;

        if (!template) return;

        try {
            const config = JSON.parse(newConfig) as Config;

            config.sheets.forEach(sheet => {
                //Validate commission type codes ------------------
                if (
                    !isValidCommissionType(
                        sheet.config.commissionTypes.defaultCommissionTypeCode,
                        commissionTypes
                    )
                )
                    sheet.config.commissionTypes.defaultCommissionTypeCode = UNKNOWN_COMMISSION_TYPE_CODE;

                sheet.config.commissionTypes.types = sheet.config.commissionTypes.types.map(t => ({
                    commissionTypeCode: isValidCommissionType(t.commissionTypeCode, commissionTypes)
                        ? t.commissionTypeCode
                        : "",
                    value: t.value,
                }));
                //--------------------------------------------------
            });

            const newTemplate: CommissionStatementTemplateEdit = {
                ...template,
                config: config,
            };

            dispatch(modifyCommissionStatementTemplate(newTemplate));

            showMessage("info", "Config Fields Updated", 3);
        } catch {
            showMessage("error", "Config error, please check syntax", 5);
        }
    };
};

export const modifyCommissionStatementTemplateSheets = (
    sheets: Sheet[]
): ThunkAction<void, RootState, {}, TemplateModifiedAction> => {
    return (dispatch, getState) => {
        const template = commissionStatementTemplateSelector(getState()).template;

        if (!template) return;

        const newTemplate: CommissionStatementTemplateEdit = update(template, {
            config: {
                sheets: {
                    $set: sheets,
                },
            },
        });

        dispatch(modifyCommissionStatementTemplate(newTemplate));
    };
};

const isValidCommissionType = (code: string, commissionTypes: CommissionType[]): boolean => {
    return !!commissionTypes.find(t => t.code === code);
};
