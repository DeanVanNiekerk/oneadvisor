import { memberPreviewSelector } from './selectors';

describe('member selectors', () => {
    it('memberSelector', () => {
        const state = {
            app: {
                member: {
                    members: {
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
        const actual = memberPreviewSelector(state);

        expect(actual).toEqual(expected);
    });
});
