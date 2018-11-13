// @flow

import { listSelector, getCachedUser } from './selectors';

describe('user list selectors', () => {
    it('listSelector', () => {
        const state = {
            app: {
                directory: {
                    users: {
                        list: {
                            property: '1'
                        }
                    }
                }
            }
        };

        const expected = {
            property: '1'
        };

        //$FlowFixMe
        const actual = listSelector(state);

        expect(actual).toEqual(expected);
    });

    it('getCachedUser', () => {
        const state = {
            app: {
                directory: {
                    users: {
                        list: {
                            items: [
                                { id: '1', firstName: 'Dean' },
                                { id: '2', firstName: 'John' }
                            ]
                        }
                    }
                }
            }
        };

        const props = {
            match: {
                params: {
                    userId: '2'
                }
            }
        };

        const expected = { id: '2', firstName: 'John' };

        //$FlowFixMe
        const actual = getCachedUser(state, props);

        expect(actual).toEqual(expected);
    });
});
