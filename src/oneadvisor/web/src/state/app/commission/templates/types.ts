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
    headerIdentifier: Identifier;
    amountIdentifier: AmountIdentifier;
    fields: Field[];
    commissionTypes: CommissionTypes;
    groups: Group[];
};

export type AmountIdentifierType = "includingVat" | "excludingVat";

export type AmountIdentifier = {
    type: AmountIdentifierType;
} & Identifier;

export type Identifier = {
    column: string;
    value: string; //This is a regex expression
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

export type Group = {
    fieldName: string;
    column: string;
    formatter: string;
    reverseOrder: boolean;
    identifiers: Identifier[];
};
