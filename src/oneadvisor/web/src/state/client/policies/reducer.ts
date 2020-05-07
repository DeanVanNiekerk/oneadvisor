import { combineReducers } from "redux";
import { PersistConfig, persistReducer } from "redux-persist";

import { getPersistStorage } from "@/state/storage";

import { reducer as listReducer } from "./list/reducer";
import { reducer as mergeReducer } from "./merge/reducer";
import { reducer as policyReducer } from "./policy/reducer";
import { reducer as searchReducer } from "./search/reducer";
import { ListState, PoliciesState } from "./types";

const listConfig: PersistConfig<ListState> = {
    key: "client-policies-list",
    whitelist: ["pageOptions"],
    storage: getPersistStorage(),
};

export const reducer = combineReducers<PoliciesState>({
    list: persistReducer(listConfig, listReducer),
    search: searchReducer,
    policy: policyReducer,
    merge: mergeReducer,
});
