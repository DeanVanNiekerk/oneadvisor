import { statementsApi } from '@/config/api/commission';

import * as actions from './actions';

describe('commission format error actions', () => {
    it('should dispatch API when fetchNextFormatError is called', () => {
        const expectedAction = {
            type: 'API',
            endpoint: `${statementsApi}/99/errors/next?hasValidFormat=false`,
            dispatchPrefix: 'COMMISSIONS_ERROR_FORMAT'
        };

        expect(actions.fetchNextFormatError('99')).toEqual(expectedAction);
    });
});
