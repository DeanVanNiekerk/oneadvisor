import { RSAA } from 'redux-api-middleware';
import { usersApi } from 'config/directoryApi'

export const USERS_LIST_RECEIVE = 'USERS_LIST_RECEIVE';
export const USERS_LIST_FETCHING = 'USERS_LIST_FETCHING';
export const USERS_LIST_FETCHING_ERROR = 'USERS_LIST_FETCHING_ERROR';

export const fetchUsers = () => ({
  [RSAA]: {
    endpoint: usersApi,
    method: 'GET',
    types: [
      USERS_LIST_FETCHING,
      USERS_LIST_RECEIVE,
      USERS_LIST_FETCHING_ERROR
    ]
  }
})
