import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { UserSimple } from "../";
import { BROKER_USER_TYPE_ID } from "../../lookups";
import { State } from "./reducer";

const rootSelector = (state: RootState): State => state.app.directory.usersSimple.list;

export const listSelector: (state: RootState) => State = createSelector(rootSelector, root => root);

export const brokersSelector: (state: RootState) => UserSimple[] = createSelector(rootSelector, root => {
    return root.items.filter(u => u.userTypeId === BROKER_USER_TYPE_ID);
});
