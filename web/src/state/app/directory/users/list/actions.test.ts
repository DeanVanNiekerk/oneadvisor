import { usersApi } from '@/config/api/directory';

import * as actions from './actions';



describe('directory: users: list actions', () => {
    it('should dispatch API when fetchUsers is called', () => {
        const expectedAction = {
            type: 'API',
            endpoint: `${usersApi}`,
            dispatchPrefix: 'USERS_LIST'
        };

        expect(actions.fetchUsers()).toEqual(expectedAction);
    });
});
