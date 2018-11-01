// @flow

import configureMockStore from 'redux-mock-store'
import { apiMiddleware } from 'redux-api-middleware'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock'

import { usersApi } from 'config/directoryApi'
import * as actions from './actions'

const middlewares = [ thunk, apiMiddleware ]
const mockStore = configureMockStore(middlewares)

describe('user list actions', () => {
  
  afterEach(() => {
    fetchMock.reset()
    fetchMock.restore()
  })

  it('should dispatch USERS_LIST_RECEIVE when fetchUsers is called', () => {

    const store = mockStore({})

    const body = [
        { id: '1', firstName: 'Jack', lastName: 'Jones'}
    ]

    fetchMock.getOnce(usersApi, { body: body })

    const expectedActions = [
      {type: "USERS_LIST_FETCHING"},
      {type: "USERS_LIST_RECEIVE", payload: body}
    ]

    return store.dispatch(actions.fetchUsers()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})