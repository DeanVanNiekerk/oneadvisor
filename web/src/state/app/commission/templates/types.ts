export type CommissionStatementTemplate = {
    id: string;
    companyId: string;
    name: string;
    startDate: string | null;
    endDate: string | null;
};

export type CommissionStatementTemplateEdit = {
    id: string;
    companyId: string;
    name: string;
    config: Config;
    startDate: string | null;
    endDate: string | null;
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
