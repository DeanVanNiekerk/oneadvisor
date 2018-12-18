import { appendQueryString } from './query';

describe('query', () => {
    it('appendQueryString - no existing query string', () => {
        const actual = appendQueryString('https://oneadvisor', [
            {
                key: 'param1',
                value: '1'
            },
            {
                key: 'param2',
                value: '2'
            }
        ]);

        expect(actual).toBe('https://oneadvisor?param1=1&param2=2');
    });

    it('appendQueryString - has existing query string', () => {
        const actual = appendQueryString('https://oneadvisor?paramx=yyy', [
            {
                key: 'param1',
                value: '1'
            },
            {
                key: 'param2',
                value: '2'
            }
        ]);

        expect(actual).toBe('https://oneadvisor?paramx=yyy&param1=1&param2=2');
    });
});
