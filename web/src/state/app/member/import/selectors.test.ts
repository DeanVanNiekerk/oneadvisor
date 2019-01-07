import { memberImportSelector, memberImportTableRowsSelector } from './selectors';

describe('member import selectors', () => {
    it('memberImportSelector', () => {
        const state = {
            app: {
                member: {
                    import: {
                        property: '1'
                    }
                }
            }
        };

        const expected = {
            property: '1'
        };

        //@ts-ignore
        const actual = memberImportSelector(state);

        expect(actual).toEqual(expected);
    });

    it('memberImportTableRowsSelector', () => {
        const state = {
            app: {
                member: {
                    import: {
                        columns: [
                            {
                                id: 'idNumber',
                                name: 'ID Number'
                            },
                            {
                                id: 'lastName',
                                name: 'Last Name'
                            }
                        ],
                        data: [['val1', 'val2'], ['val3', 'val4']]
                    }
                }
            }
        };

        const expected = [
            {
                idNumber: 'val1',
                lastName: 'val2'
            },
            {
                idNumber: 'val3',
                lastName: 'val4'
            }
        ];
        //@ts-ignore
        const actual = memberImportTableRowsSelector(state);

        expect(actual).toEqual(expected);
    });
});
