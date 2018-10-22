import React from 'react';
import UserList from './UserList';
import configureMockStore from 'redux-mock-store'
import renderer from 'react-test-renderer';

const mockStore = configureMockStore()

describe('UserList', () => {

    it('renders table', () => {

        const store = mockStore({
            directory: {
                users: {
                    list: {
                        items: [
                            { id: 1, firstName: 'Jack', lastName: 'Johnson' }
                        ]
                    }
                }
            }
        })

        store.dispatch = jest.fn();

        const tree = renderer
            .create(<UserList store={store} />)
            .toJSON();

        expect(store.dispatch.mock.calls.length).toBe(1);

        expect(tree).toMatchSnapshot();
    });

    it('renders error', () => {

        const store = mockStore({
            directory: {
                users: {
                    list: {
                        error: true
                    }
                }
            }
        })

        store.dispatch = jest.fn();

        const tree = renderer
            .create(<UserList store={store} />)
            .toJSON();

        expect(store.dispatch.mock.calls.length).toBe(1);

        expect(tree).toMatchSnapshot();
    });

    it('renders loader', () => {

        const store = mockStore({
            directory: {
                users: {
                    list: {
                        fetching: true
                    }
                }
            }
        })

        store.dispatch = jest.fn();

        const tree = renderer
            .create(<UserList store={store} />)
            .toJSON();

        expect(store.dispatch.mock.calls.length).toBe(1);

        expect(tree).toMatchSnapshot();
    });

});