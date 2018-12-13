import { memberSelector } from './selectors';

describe('member selectors', () => {
    it('memberSelector', () => {
        const state = {
            app: {
                member: {
                    members: {
                        member: {
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
        const actual = memberSelector(state);

        expect(actual).toEqual(expected);
    });
});
