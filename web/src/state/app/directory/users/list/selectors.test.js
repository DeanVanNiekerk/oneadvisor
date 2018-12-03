// @flow

import { listSelector } from './selectors';

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
});
