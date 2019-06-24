import { listSelector } from './selectors';

describe('client list selectors', () => {
    it('listSelector', () => {
        const state = {
            app: {
                client: {
                    clients: {
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
