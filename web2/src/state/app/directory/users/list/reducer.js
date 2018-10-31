import * as types from './actions';

export const defaultState = {
  items: [],
  fetching: false,
  error: false
}

export const reducer = (state = defaultState, action) => {

  switch (action.type) {
    case types.USERS_LIST_RECEIVE: {
      return {
        ...state,
        items: action.payload,
        fetching: false,
        error: false
      }
    }
    case types.USERS_LIST_FETCHING: {
      return {
        ...state,
        fetching: true
      }
    }
    case types.USERS_LIST_FETCHING_ERROR: {
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
