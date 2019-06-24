import { commissionStatementTemplateSelector } from './selectors';

describe('commission statement template selectors', () => {
    it('commissionSelector', () => {
        const state = {
            app: {
                commission: {
                    templates: {
                        template: {
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
        const actual = commissionStatementTemplateSelector(state);

        expect(actual).toEqual(expected);
    });
});
