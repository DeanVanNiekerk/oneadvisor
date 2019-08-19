import { companiesSelector } from "./selectors";

describe('company list selectors', () => {
    it('companiesSelector', () => {
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
        const actual = companiesSelector(state);

        expect(actual).toEqual(expected);
    });
});
