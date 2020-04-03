export type CommissionStatementTemplateFieldName = {
    id: string;
    name: string;
};

export type CommissionStatementTemplateFieldNameListState = {
    readonly items: CommissionStatementTemplateFieldName[];
};

export type CommissionStatementTemplateFieldNamesState = {
    readonly list: CommissionStatementTemplateFieldNameListState;
};
