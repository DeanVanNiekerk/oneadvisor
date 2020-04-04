import { createSelector } from "reselect";

import { RootState } from "@/state";

import { ListState, UserSimple } from "../";
import { BROKER_USER_TYPE_ID } from "../../lookups";

const rootSelector = (state: RootState): ListState => state.directory.usersSimple.list;

export const usersSimpleSelector: (state: RootState) => ListState = createSelector(
    rootSelector,
    (root) => root
);

export const brokersSelector: (state: RootState) => UserSimple[] = createSelector(
    rootSelector,
    (root) => {
        return root.items.filter((u) => u.userTypeId === BROKER_USER_TYPE_ID);
    }
);
