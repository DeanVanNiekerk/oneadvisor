import { commissionSelector } from './selectors';

describe('commission selectors', () => {
    it('commissionSelector', () => {
        const state = {
            app: {
                commission: {
                    commissions: {
                        commission: {
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
        const actual = commissionSelector(state);

        expect(actual).toEqual(expected);
    });
});
