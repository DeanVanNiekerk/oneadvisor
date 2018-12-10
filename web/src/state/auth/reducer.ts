import * as types from './actions';
import { UserInfo } from './types';



export type State = {
  readonly authenticated: boolean,
  readonly userInfo: UserInfo | null,
  readonly idToken: string | null,
  readonly accessToken: string | null
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
