export type CommissionStatementTemplate = {
    id: string;
    companyId: string;
    name: string;
};

export type CommissionStatementTemplateEdit = {
    id: string;
    companyId: string;
    name: string;
    config: Config;
};

export type Config = {
    dataStart: DataStart;
    fields: Field[];
    commissionTypes: CommissionTypes;
};

export type DataStart = {
    headerColumn: string;
    headerValue: string;
};

export type Field = {
    name: string;
    column: string;
};

export type CommissionTypes = {
    mappingTemplate: string;
    defaultCommissionTypeId: string;
    types: CommissionType[];
};

export type CommissionType = {
    commissionTypeId: string;
    value: string;
};
