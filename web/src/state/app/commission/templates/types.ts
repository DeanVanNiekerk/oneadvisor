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
};

export type DataStart = {
    headerColumn: string;
    headerValue: string;
};
