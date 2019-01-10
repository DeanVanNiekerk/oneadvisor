import { memberImportProgressPercentSelector, memberImportSelector, memberImportTableRowsSelector } from './selectors';

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

        //@ts-ignore
        const actual = memberImportTableRowsSelector(state);

        expect(actual[0].idNumber).toEqual('val1');
        expect(actual[0].lastName).toEqual('val2');

        expect(actual[1].idNumber).toEqual('val3');
        expect(actual[1].lastName).toEqual('val4');
    });

    it('memberImportTableRowsSelector', () => {
        const state = {
            app: {
                member: {
                    import: {
                        members: [
                            {
                                idNumber: '1'
                            },
                            {
                                idNumber: '2'
                            },
                            {
                                idNumber: '3'
                            },
                            {
                                idNumber: '4'
                            }
                        ],
                        resultsSuccess: ['val1'],
                        resultsFailure: ['val1']
                    }
                }
            }
        };

        //@ts-ignore
        const percent = memberImportProgressPercentSelector(state);

        expect(percent).toEqual(50);
    });
});
