import { searchSelector } from './selectors';

describe('client search selectors', () => {
    it('searchSelector', () => {
        const state = {
            app: {
                client: {
                    clients: {
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
