import { listSelector } from './selectors';

describe('member list selectors', () => {
    it('listSelector', () => {
        const state = {
            app: {
                member: {
                    members: {
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
