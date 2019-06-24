import { parseIdNumber } from './id';

describe('id', () => {
    describe('parseIdNumber', () => {
        it('empty', () => {
            const id = '';

            const result = parseIdNumber(id);

            expect(result.success).toEqual(false);
        });

        it('letters', () => {
            const id = 'abc';

            const result = parseIdNumber(id);

            expect(result.success).toEqual(false);
        });

        it('date', () => {
            const id = '821003';

            const result = parseIdNumber(id);

            expect(result.success).toEqual(false);
            expect(result.dateOfBirth).toEqual('1982-10-03');
        });

        it('gender', () => {
            const id = '8210038000';

            const result = parseIdNumber(id);

            expect(result.success).toEqual(false);
            expect(result.gender).toEqual('M');
        });

        it('bad checksum', () => {
            const id = '8210035032081';

            const result = parseIdNumber(id);

            expect(result.success).toEqual(false);
            expect(result.dateOfBirth).toEqual('1982-10-03');
            expect(result.gender).toEqual('M');
        });

        it('success', () => {
            const id = '8210035032082';

            const result = parseIdNumber(id);

            expect(result.success).toEqual(true);
            expect(result.dateOfBirth).toEqual('1982-10-03');
            expect(result.gender).toEqual('M');
        });
    });
});
