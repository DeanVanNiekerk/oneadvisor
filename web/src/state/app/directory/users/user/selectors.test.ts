

import { userSelector } from './selectors';

describe('user selectors', () => {
    it('userSelector', () => {
        const state = {
            app: {
                directory: {
                    users: {
                        user: {
                            property: '1'
                        }
                    }
                }
            }
        };

        const expected = {
            property: '1'
        };

        //@ts-ignore
        const actual = userSelector(state);

        expect(actual).toEqual(expected);
    });
});
