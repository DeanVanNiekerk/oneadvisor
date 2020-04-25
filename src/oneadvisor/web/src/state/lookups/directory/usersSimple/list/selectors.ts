import { createSelector } from "reselect";

import { RootState } from "@/state";
import { BROKER_USER_TYPE_ID } from "@/state/lookups/directory";

import { UserSimple, UserSimpleListState } from "../";

const rootSelector = (state: RootState): UserSimpleListState =>
    state.lookups.directory.usersSimple.list;

export const usersSimpleSelector: (state: RootState) => UserSimpleListState = createSelector(
    rootSelector,
    (root) => root
);

export const brokersSelector: (state: RootState) => UserSimple[] = createSelector(
    rootSelector,
    (root) => {
        return root.items.filter((u) => u.userTypeId === BROKER_USER_TYPE_ID);
    }
);
