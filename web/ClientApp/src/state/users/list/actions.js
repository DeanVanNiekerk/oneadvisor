import { RSAA } from 'redux-api-middleware';
import config from 'config/config'

export const USERS_LIST_RECEIVE = 'USERS_LIST_RECEIVE';
export const USERS_LIST_FETCHING = 'USERS_LIST_FETCHING';
export const USERS_LIST_FETCHING_ERROR = 'USERS_LIST_FETCHING_ERROR';

export const fetchUsers = () => ({
  [RSAA]: {
    endpoint: `${config.directoryApi}/api/users/index`,
    method: 'GET',
    types: [
      USERS_LIST_FETCHING,
      USERS_LIST_RECEIVE,
      USERS_LIST_FETCHING_ERROR
    ]
  }
})
