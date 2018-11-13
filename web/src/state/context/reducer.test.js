// @flow

import { reducer, defaultState } from './reducer';
import * as types from './actions';

describe('auth reducer', () => {
    it('should handle CONTEXT_RECIEVE_BREADCRUMB', () => {
        const payload = 'bread/crumb';

        const actualState = reducer(defaultState, {
            type: 'CONTEXT_RECIEVE_BREADCRUMB',
            payload: payload
        });

        const expectedState = {
            ...defaultState,
            breadCrumb: payload
        };

        expect(actualState).toEqual(expectedState);
    });
});
