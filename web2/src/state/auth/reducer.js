// @flow

import * as types from './actions';
import type { UserInfo } from './types'
import type { Action } from './actions'

export type State = {
  +authenticated: boolean,
  +userInfo: ?UserInfo,
  +idToken: ?string,
  +accessToken: ?string
}

export const defaultState = {
  authenticated: false,
  userInfo: null,
  idToken: null,
  accessToken: null
}

export const reducer = (state: State = defaultState, action: Action) => {

  switch (action.type) {
    case "AUTH_RECIEVE_AUTHENTICATION": {
      return {
        ...state,
        authenticated: true,
        userInfo: action.payload.userInfo,
        idToken: action.payload.idToken,
        accessToken: action.payload.accessToken
      }
    }
    case "AUTH_RECIEVE_AUTHENTICATION_CLEAR": {
      return {
        ...defaultState
      }
    }
    default: return state;
  }

};
