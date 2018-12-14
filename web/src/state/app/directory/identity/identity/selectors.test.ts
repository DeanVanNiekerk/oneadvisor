import { identitySelector } from './selectors';

describe('identity selectors', () => {
    it('identitySelector', () => {
        const state = {
            app: {
                directory: {
                    identity: {
                        identity: {
                            firstName: '1'
                        }
                    }
                }
            }
        };

        const expected = {
            firstName: '1'
        };

        //@ts-ignore
        const actual = identitySelector(state);

        expect(actual).toEqual(expected);
    });
});
