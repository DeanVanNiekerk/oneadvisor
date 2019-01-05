import { listSelector } from './selectors';

describe('company list selectors', () => {
    it('listSelector', () => {
        const state = {
            app: {
                directory: {
                    lookups: {
                        companies: {
                            list: {
                                property: '1'
                            }
                        }
                    }
                }
            }
        };

        const expected = {
            property: '1'
        };

        //@ts-ignore
        const actual = listSelector(state);

        expect(actual).toEqual(expected);
    });
});
