import { rolesApi } from '@/config/api/directory';

import * as actions from './actions';

describe('directory: roles: list actions', () => {
    it('should dispatch API when fetchRoles is called', () => {
        const expectedAction = {
            type: 'API',
            endpoint: `${rolesApi}`,
            dispatchPrefix: 'ROLES_LIST'
        };

        expect(actions.fetchRoles()).toEqual(expectedAction);
    });
});
