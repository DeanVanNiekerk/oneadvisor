// @flow

import * as actions from './actions';

describe('context actions', () => {
    it('should dispatch CONTEXT_RECIEVE_BREADCRUMB when recieveBreadCrumb is called', () => {
        const breadCrumb = '321312';

        const expectedAction = {
            type: 'CONTEXT_RECIEVE_BREADCRUMB',
            payload: breadCrumb
        };

        expect(actions.recieveBreadCrumb(breadCrumb)).toEqual(expectedAction);
    });
});
