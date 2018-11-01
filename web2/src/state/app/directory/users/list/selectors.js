// @flow

import { createSelector } from 'reselect'
import type { User } from './types'
import type { State } from './reducer'

const rootSelector = (state): State => state.app.directory.users.list

export const listSelector: (state: any) => State = createSelector(
    rootSelector,
    root => root
)