import { appendQueryString } from './query';

describe('query', () => {
    it('appendQueryString - no existing query string', () => {
        const actual = appendQueryString('https://oneadvisor', {
            param1: 1,
            param2: '2'
        });

        expect(actual).toBe('https://oneadvisor?param1=1&param2=2');
    });

    it('appendQueryString - has existing query string', () => {
        const actual = appendQueryString('https://oneadvisor?paramx=yyy', {
            param1: 1,
            param2: '2'
        });

        expect(actual).toBe('https://oneadvisor?param1=1&param2=2&paramx=yyy');
    });
});
