import { useCasesApi } from '@/config/api/directory';

import * as actions from './actions';

describe('directory: useCases: list actions', () => {
    it('should dispatch API when fetchUseCases is called', () => {
        const expectedAction = {
            type: 'API',
            endpoint: `${useCasesApi}`,
            dispatchPrefix: 'USECASES_LIST'
        };

        expect(actions.fetchUseCases()).toEqual(expectedAction);
    });
});
