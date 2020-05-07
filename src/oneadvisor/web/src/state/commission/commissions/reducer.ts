import { combineReducers } from "redux";
import { PersistConfig, persistReducer } from "redux-persist";

import { getPersistStorage } from "@/state/storage";

import { reducer as commissionReducer } from "./commission/reducer";
import { reducer as listReducer } from "./list/reducer";
import { CommissionsState, ListState } from "./types";

const listConfig: PersistConfig<ListState> = {
    key: "commission-commissions-list",
    whitelist: ["pageOptions"],
    storage: getPersistStorage(),
};

export const reducer = combineReducers<CommissionsState>({
    list: persistReducer(listConfig, listReducer),
    commission: commissionReducer,
});
