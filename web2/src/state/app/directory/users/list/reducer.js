// @flow

import * as types from './actions';
import type { User } from './types'
import type { Action } from './actions'

export type State = {
  +items: User[],
  +fetching: boolean,
  +error: boolean
}

export const defaultState: State = {
  items: [],
  fetching: false,
  error: false
}

export const reducer = (state: State = defaultState, action: Action) => {

  switch (action.type) {
    case "USERS_LIST_RECEIVE": {
      return {
        ...state,
        items: action.payload,
        fetching: false,
        error: false
      }
    }
    case "USERS_LIST_FETCHING": {
      return {
        ...state,
        fetching: true
      }
    }
    case "USERS_LIST_FETCHING_ERROR": {
      return {
        ...state,
        items: [],
        fetching: false,
        error: true
      }
    }
    default: return state;
  }

};
