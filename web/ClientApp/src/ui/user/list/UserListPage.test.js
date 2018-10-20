import React from 'react';
import UserListPage from './UserListPage';
import configureMockStore from 'redux-mock-store'
import renderer from 'react-test-renderer';

const mockStore = configureMockStore()

describe('UserListPage', () => {

    it('renders table', () => {

        const store = mockStore({ 
            users: {
                list: {
                    items: [
                        { id: 1, firstName: 'Jack', lastName: 'Johnson' }
                    ]
                }
            }
        })

        store.dispatch = jest.fn();

        const tree = renderer
            .create(<UserListPage store={store} />)
            .toJSON();

        expect(store.dispatch.mock.calls.length).toBe(1);

        expect(tree).toMatchSnapshot();
    });

    it('renders error', () => {

        const store = mockStore({ 
            users: {
                list: {
                    error: true
                }
            }
        })

        store.dispatch = jest.fn();

        const tree = renderer
            .create(<UserListPage store={store} />)
            .toJSON();

        expect(store.dispatch.mock.calls.length).toBe(1);

        expect(tree).toMatchSnapshot();
    });

    it('renders loader', () => {

        const store = mockStore({ 
            users: {
                list: {
                    fetching: true
                }
            }
        })

        store.dispatch = jest.fn();

        const tree = renderer
            .create(<UserListPage store={store} />)
            .toJSON();

        expect(store.dispatch.mock.calls.length).toBe(1);

        expect(tree).toMatchSnapshot();
    });

});