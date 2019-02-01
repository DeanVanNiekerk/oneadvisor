import {
    commissionImportProgressPercentSelector, commissionImportSelectedColumnsSelector, commissionImportSelector,
    commissionImportTableRowsSelector
} from './selectors';

describe('commission import selectors', () => {
    it('commissionImportSelector', () => {
        const state = {
            app: {
                commission: {
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
        const actual = commissionImportSelector(state);

        expect(actual).toEqual(expected);
    });

    it('commissionImportTableRowsSelector', () => {
        const state = {
            app: {
                commission: {
                    import: {
                        selectedColumns: ['idNumber', 'lastName'],
                        data: [['val1', 'val2'], ['val3', 'val4']]
                    }
                }
            }
        };

        //@ts-ignore
        const actual = commissionImportTableRowsSelector(state);

        expect(actual.length).toEqual(2);

        expect(actual[0].idNumber).toEqual('val1');
        expect(actual[0].lastName).toEqual('val2');

        expect(actual[1].idNumber).toEqual('val3');
        expect(actual[1].lastName).toEqual('val4');
    });

    it('commissionImportSelectedColumnsSelector', () => {
        const state = {
            app: {
                commission: {
                    import: {
                        columns: [
                            {
                                id: 'policyNumber',
                                name: 'Policy Number'
                            },
                            {
                                id: 'amountIncludingVAT',
                                name: 'Amount (Incl VAT)'
                            },
                            {
                                id: 'vat',
                                name: 'VAT'
                            }
                        ],
                        selectedColumns: ['policyNumber', 'amountIncludingVAT'],
                        data: [['val1', 'val2'], ['val3', 'val4']]
                    }
                }
            }
        };

        //@ts-ignore
        const actual = commissionImportSelectedColumnsSelector(state);

        expect(actual.length).toEqual(2);

        expect(actual[0].id).toEqual('policyNumber');
        expect(actual[0].name).toEqual('Policy Number');

        expect(actual[1].id).toEqual('amountIncludingVAT');
        expect(actual[1].name).toEqual('Amount (Incl VAT)');
    });

    it('commissionImportProgressPercentSelector', () => {
        const state = {
            app: {
                commission: {
                    import: {
                        commissions: [
                            {
                                policyNumber: '1'
                            },
                            {
                                policyNumber: '2'
                            },
                            {
                                policyNumber: '3'
                            },
                            {
                                policyNumber: '4'
                            }
                        ],
                        resultsSuccess: ['val1'],
                        resultsFailure: ['val1']
                    }
                }
            }
        };

        //@ts-ignore
        const percent = commissionImportProgressPercentSelector(state);

        expect(percent).toEqual(50);
    });
});
