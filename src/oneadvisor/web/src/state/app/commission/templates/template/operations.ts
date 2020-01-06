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
    commissionStatementTemplateVisible,
    modifyCommissionStatementTemplate,
    receiveCommissionStatementTemplate,
    TemplateModifiedAction,
    TemplateReceiveAction,
    TemplateVisibleAction,
} from "../";
import {
    CommissionType,
    commissionTypesSelector,
    UNKNOWN_COMMISSION_TYPE_CODE,
} from "../../lookups";
import {
    AmountIdentifier,
    CommissionStatementTemplateEdit,
    CommissionTypes,
    Config,
    Field,
    Group,
    Identifier,
    Sheet,
    VATRate,
} from "../types";

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
                        amountIdentifier: {
                            column: "",
                            value: "",
                            type: "excludingVat",
                        },
                        fields: [],
                        commissionTypes: {
                            defaultCommissionTypeCode: UNKNOWN_COMMISSION_TYPE_CODE,
                            mappingTemplate: "",
                            types: [],
                        },
                        groups: [],
                        vatRates: [],
                    },
                },
            ],
        },
    };
    return receiveCommissionStatementTemplate(template);
};

export const saveCommissionStatementTemplate = (
    updateUnknownCommissionTypes: boolean,
    showMessage: ShowMessage,
    onSaved?: (template: CommissionStatementTemplateEdit) => void,
    onFailed?: () => void,
    disableSuccessMessage = false
): ThunkAction<void, RootState, {}, TemplateReceiveAction | TemplateVisibleAction | ApiAction> => {
    return (dispatch, getState) => {
        const { template } = commissionStatementTemplateSelector(getState());
        if (!template) return;

        const onSuccess = (templateEdit: CommissionStatementTemplateEdit) => {
            if (onSaved) onSaved(templateEdit);
        };

        if (template.id) {
            dispatch(
                updateCommissionStatementTemplate(
                    template,
                    updateUnknownCommissionTypes,
                    () => {
                        if (!disableSuccessMessage)
                            showMessage("success", "Template Successfully Saved", 3);
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
                        dispatch(commissionStatementTemplateVisible(false));
                    },
                    onFailed
                )
            );
        }
    };
};

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

        const modifiedTemplate: CommissionStatementTemplateEdit = update(template, {
            config: {
                sheets: {
                    $set: sheets,
                },
            },
        });

        dispatch(modifyCommissionStatementTemplate(modifiedTemplate));
    };
};

export const modifyCommissionStatementTemplateHeaderIdentifier = (
    headerIdentifier: Identifier
): ThunkAction<void, RootState, {}, TemplateModifiedAction> => {
    return (dispatch, getState) => {
        const { template, templateSheetIndex } = commissionStatementTemplateSelector(getState());

        if (!template) return;

        const modifiedTemplate: CommissionStatementTemplateEdit = update(template, {
            config: {
                sheets: {
                    [templateSheetIndex]: {
                        config: {
                            headerIdentifier: {
                                $set: headerIdentifier,
                            },
                        },
                    },
                },
            },
        });

        dispatch(modifyCommissionStatementTemplate(modifiedTemplate));
    };
};

export const modifyCommissionStatementTemplateAmountIdentifier = (
    amountIdentifier: AmountIdentifier
): ThunkAction<void, RootState, {}, TemplateModifiedAction> => {
    return (dispatch, getState) => {
        const { template, templateSheetIndex } = commissionStatementTemplateSelector(getState());

        if (!template) return;

        const modifiedTemplate: CommissionStatementTemplateEdit = update(template, {
            config: {
                sheets: {
                    [templateSheetIndex]: {
                        config: {
                            amountIdentifier: {
                                $set: amountIdentifier,
                            },
                        },
                    },
                },
            },
        });

        dispatch(modifyCommissionStatementTemplate(modifiedTemplate));
    };
};

export const modifyCommissionStatementTemplateCommissionTypes = (
    commissionTypes: CommissionTypes
): ThunkAction<void, RootState, {}, TemplateModifiedAction> => {
    return (dispatch, getState) => {
        const { template, templateSheetIndex } = commissionStatementTemplateSelector(getState());

        if (!template) return;

        const modifiedTemplate: CommissionStatementTemplateEdit = update(template, {
            config: {
                sheets: {
                    [templateSheetIndex]: {
                        config: {
                            commissionTypes: {
                                $set: commissionTypes,
                            },
                        },
                    },
                },
            },
        });

        dispatch(modifyCommissionStatementTemplate(modifiedTemplate));
    };
};

export const modifyCommissionStatementTemplateFields = (
    fields: Field[]
): ThunkAction<void, RootState, {}, TemplateModifiedAction> => {
    return (dispatch, getState) => {
        const { template, templateSheetIndex } = commissionStatementTemplateSelector(getState());

        if (!template) return;

        const modifiedTemplate: CommissionStatementTemplateEdit = update(template, {
            config: {
                sheets: {
                    [templateSheetIndex]: {
                        config: {
                            fields: {
                                $set: fields,
                            },
                        },
                    },
                },
            },
        });

        dispatch(modifyCommissionStatementTemplate(modifiedTemplate));
    };
};

export const modifyCommissionStatementTemplateGroups = (
    groups: Group[]
): ThunkAction<void, RootState, {}, TemplateModifiedAction> => {
    return (dispatch, getState) => {
        const { template, templateSheetIndex } = commissionStatementTemplateSelector(getState());

        if (!template) return;

        const modifiedTemplate: CommissionStatementTemplateEdit = update(template, {
            config: {
                sheets: {
                    [templateSheetIndex]: {
                        config: {
                            groups: {
                                $set: groups,
                            },
                        },
                    },
                },
            },
        });

        dispatch(modifyCommissionStatementTemplate(modifiedTemplate));
    };
};

export const modifyCommissionStatementTemplateVATRates = (
    vatRates: VATRate[]
): ThunkAction<void, RootState, {}, TemplateModifiedAction> => {
    return (dispatch, getState) => {
        const { template, templateSheetIndex } = commissionStatementTemplateSelector(getState());

        if (!template) return;

        const modifiedTemplate: CommissionStatementTemplateEdit = update(template, {
            config: {
                sheets: {
                    [templateSheetIndex]: {
                        config: {
                            vatRates: {
                                $set: vatRates,
                            },
                        },
                    },
                },
            },
        });

        dispatch(modifyCommissionStatementTemplate(modifiedTemplate));
    };
};

const isValidCommissionType = (code: string, commissionTypes: CommissionType[]): boolean => {
    return !!commissionTypes.find(t => t.code === code);
};
