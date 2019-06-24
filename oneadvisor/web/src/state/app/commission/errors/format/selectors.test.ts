import { formatErrorSelector } from './selectors';

describe('statement selectors', () => {
    it('statementSelector', () => {
        const state = {
            app: {
                commission: {
                    errors: {
                        format: {
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
        const actual = formatErrorSelector(state);

        expect(actual).toEqual(expected);
    });
});
