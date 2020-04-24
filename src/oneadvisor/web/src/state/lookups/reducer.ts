import { combineReducers } from "redux";

import { reducer as client } from "./client/reducer";
import { reducer as directory } from "./directory/reducer";
import { LookupsState } from "./types";

export const reducer = combineReducers<LookupsState>({
    client: client,
    directory: directory,
});
