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
    sheets: Sheet[];
};

export type Sheet = {
    position: number;
    config: SheetConfig;
};

export type SheetConfig = {
    headerIdentifier: HeaderIdentifier;
    fields: Field[];
    commissionTypes: CommissionTypes;
};

export type HeaderIdentifier = {
    column: string;
    value: string;
};

export type Field = {
    name: string;
    column: string;
    absoluteValue: boolean;
};

export type CommissionTypes = {
    mappingTemplate: string;
    defaultCommissionTypeCode: string;
    types: CommissionType[];
};

export type CommissionType = {
    commissionTypeCode: string;
    value: string;
};
