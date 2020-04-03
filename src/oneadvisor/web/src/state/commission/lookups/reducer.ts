import { combineReducers } from "redux";

import { reducer as all } from "./all/reducer";
import { reducer as commissionEarningsTypes } from "./commissionEarningsTypes/reducer";
import { reducer as commissionStatementTemplateFieldNames } from "./commissionStatementTemplateFieldNames/reducer";
import { reducer as commissionStatementTemplateGroupFieldNames } from "./commissionStatementTemplateGroupFieldNames/reducer";
import { reducer as commissionTypes } from "./commissionTypes/reducer";
import { LookupsState } from "./types";

export const reducer = combineReducers<LookupsState>({
    all: all,
    commissionTypes: commissionTypes,
    commissionStatementTemplateFieldNames: commissionStatementTemplateFieldNames,
    commissionStatementTemplateGroupFieldNames: commissionStatementTemplateGroupFieldNames,
    commissionEarningsTypes: commissionEarningsTypes,
});
