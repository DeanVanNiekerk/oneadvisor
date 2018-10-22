import { createSelector } from 'reselect'

const rootSelector = state => state.directory.users.list

export const listSelector = createSelector(
    rootSelector,
    root => root
)