// @flow

import fetchMock from 'fetch-mock';
import configureMockStore from 'redux-mock-store';
import { apiMiddleware } from 'redux-api-middleware';
import thunk from 'redux-thunk';

import { usersApi } from '@/config/api/directory';
import * as actions from './actions';

const middlewares = [thunk, apiMiddleware];
const mockStore = configureMockStore(middlewares);

describe('user actions', () => {
    afterEach(() => {
        fetchMock.reset();
        fetchMock.restore();
    });

    it('should dispatch USERS_USER_RECEIVE when fetchUser is called', () => {
        const store = mockStore({});

        const body = [{ id: '99', firstName: 'Jack', lastName: 'Jones' }];

        fetchMock.getOnce(`${usersApi}/99`, { body: body });

        const expectedActions = [
            { type: 'USERS_USER_FETCHING' },
            { type: 'USERS_USER_RECEIVE', payload: body }
        ];

        return store.dispatch(actions.fetchUser('99')).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
