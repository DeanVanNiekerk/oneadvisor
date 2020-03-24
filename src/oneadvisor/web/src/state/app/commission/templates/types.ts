export type CommissionStatementTemplate = {
    id: string;
    companyId: string;
    name: string;
    startDate: string | null;
    endDate: string | null;
};

export type CommissionStatementTemplateEdit = {
    id: string | null;
    companyId: string | null;
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
    vatRates: VATRate[];
    exchangeRates: ExchangeRates;
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
    negateValue: boolean; //Make positive negitive and negitive positive
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

export type VATRate = {
    column: string;
    value: string;
    rate: number;
};

export type ExchangeRates = {
    headerIdentifier: Identifier;
    currencyColumn: string;
    exchangeRateColumn: string;
};
