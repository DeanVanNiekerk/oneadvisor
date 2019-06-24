import { statementPreviewSelector } from './selectors';

describe('statement selectors', () => {
    it('statementSelector', () => {
        const state = {
            app: {
                commission: {
                    statements: {
                        preview: {
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
        const actual = statementPreviewSelector(state);

        expect(actual).toEqual(expected);
    });
});
