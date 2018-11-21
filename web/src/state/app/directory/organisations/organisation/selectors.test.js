// @flow

import { organisationSelector } from './selectors';

describe('organisation selectors', () => {
    it('organisationSelector', () => {
        const state = {
            app: {
                directory: {
                    organisations: {
                        organisation: {
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
        const actual = organisationSelector(state);

        expect(actual).toEqual(expected);
    });
});
