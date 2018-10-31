import { createSelector } from 'reselect'

const rootSelector = state => state.app.directory.users.list

export const listSelector = createSelector(
    rootSelector,
    root => root
)