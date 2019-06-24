import { branchSelector } from './selectors';

describe('branch selectors', () => {
    it('branchSelector', () => {
        const state = {
            app: {
                directory: {
                    branches: {
                        branch: {
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
        const actual = branchSelector(state);

        expect(actual).toEqual(expected);
    });
});
