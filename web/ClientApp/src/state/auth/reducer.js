import * as types from './actions';

export const defaultState = {
  authenticated: false,
  userInfo: null,
  idToken: null,
  accessToken: null
}

export default (state = defaultState, action) => {

  switch (action.type) {
    case types.AUTH_RECIEVE_AUTHENTICATION: {
      return {
        ...state,
        authenticated: true,
        userInfo: action.payload.userInfo,
        idToken: action.payload.idToken,
        accessToken: action.payload.accessToken
      }
    }
    case types.AUTH_RECIEVE_AUTHENTICATION_CLEAR: {
      return {
        ...defaultState
      }
    }
    default: return state;
  }

};
