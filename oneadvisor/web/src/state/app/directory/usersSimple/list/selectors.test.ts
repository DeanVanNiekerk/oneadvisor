import { listSelector } from './selectors';

describe('user simple list selectors', () => {
    it('listSelector', () => {
        const state = {
            app: {
                directory: {
                    usersSimple: {
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
