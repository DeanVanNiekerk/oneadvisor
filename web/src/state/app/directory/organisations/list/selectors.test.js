// @flow

import { listSelector, getCachedOrganisation } from './selectors';

describe('organisation list selectors', () => {
    it('listSelector', () => {
        const state = {
            app: {
                directory: {
                    organisations: {
                        list: {
                            property: '1'
                        }
                    }
                }
            }
        };

        const expected = {
            property: '1'
        };

        //$FlowFixMe
        const actual = listSelector(state);

        expect(actual).toEqual(expected);
    });

    it('getCachedOrganisation', () => {
        const state = {
            app: {
                directory: {
                    organisations: {
                        list: {
                            items: [
                                { id: '1', firstName: 'Dean' },
                                { id: '2', firstName: 'John' }
                            ]
                        }
                    }
                }
            }
        };

        const props = {
            match: {
                params: {
                    organisationId: '2'
                }
            }
        };

        const expected = { id: '2', firstName: 'John' };

        //$FlowFixMe
        const actual = getCachedOrganisation(state, props);

        expect(actual).toEqual(expected);
    });
});
