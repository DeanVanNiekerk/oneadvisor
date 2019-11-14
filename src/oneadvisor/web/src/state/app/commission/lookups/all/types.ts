import {
    CommissionEarningsType,
    CommissionStatementTemplateFieldName,
    CommissionStatementTemplateGroupFieldName,
    CommissionType,
} from "../";

export type Lookups = {
    commissionTypes: CommissionType[];
    commissionEarningsTypes: CommissionEarningsType[];
    commissionStatementTemplateFieldNames: CommissionStatementTemplateFieldName[];
    commissionStatementTemplateGroupFieldNames: CommissionStatementTemplateGroupFieldName[];
};
