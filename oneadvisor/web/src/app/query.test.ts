import { appendQueryString, applyLike } from './query';

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

    it('applyLike', () => {
        const filters = {
            field1: ['val1', 'val1'],
            field2: ['val3', 'val4']
        };

        const actual = applyLike(filters, ['field1']);

        expect(actual).toEqual({
            field1: ['%val1%', '%val1%'],
            field2: ['val3', 'val4']
        });
    });
});
