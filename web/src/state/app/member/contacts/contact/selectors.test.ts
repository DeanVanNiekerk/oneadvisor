import { contactSelector } from './selectors';

describe('contact selectors', () => {
    it('contactSelector', () => {
        const state = {
            app: {
                member: {
                    contacts: {
                        contact: {
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
        const actual = contactSelector(state);

        expect(actual).toEqual(expected);
    });
});
