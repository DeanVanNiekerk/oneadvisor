import { listSelector } from './selectors';

describe('statement list selectors', () => {
    it('listSelector', () => {
        const state = {
            app: {
                commission: {
                    statements: {
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

        //@ts-ignore
        const actual = listSelector(state);

        expect(actual).toEqual(expected);
    });
});
