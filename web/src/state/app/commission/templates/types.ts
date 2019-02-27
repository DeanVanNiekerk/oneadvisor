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

type Config = {
    dataStart: DataStart;
};

type DataStart = {
    headerColumn: string;
    headerValue: string;
};
