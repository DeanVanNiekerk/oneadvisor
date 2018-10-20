import { RSAA } from 'redux-api-middleware';

export const USERS_LIST_RECEIVE = 'USERS_LIST_RECEIVE';
export const USERS_LIST_FETCHING = 'USERS_LIST_FETCHING';
export const USERS_LIST_FETCHING_ERROR = 'USERS_LIST_FETCHING_ERROR';

export const fetchUsers = () => ({
  [RSAA]: {
    endpoint: 'https://localhost:6001/api/users/index',
    method: 'GET',
    types: [
      USERS_LIST_FETCHING,
      USERS_LIST_RECEIVE,
      USERS_LIST_FETCHING_ERROR
    ]
  }
})
