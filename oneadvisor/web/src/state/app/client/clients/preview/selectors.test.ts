import { clientPreviewSelector } from './selectors';

describe('client selectors', () => {
    it('clientSelector', () => {
        const state = {
            app: {
                client: {
                    clients: {
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
        const actual = clientPreviewSelector(state);

        expect(actual).toEqual(expected);
    });
});
