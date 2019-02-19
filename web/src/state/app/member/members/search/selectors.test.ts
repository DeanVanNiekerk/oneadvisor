import { searchSelector } from './selectors';

describe('member search selectors', () => {
    it('searchSelector', () => {
        const state = {
            app: {
                member: {
                    members: {
                        search: {
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
        const actual = searchSelector(state);

        expect(actual).toEqual(expected);
    });
});
