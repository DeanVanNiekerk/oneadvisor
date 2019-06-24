import { listSelector } from './selectors';

describe('contact list selectors', () => {
    it('listSelector', () => {
        const state = {
            app: {
                client: {
                    contacts: {
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
