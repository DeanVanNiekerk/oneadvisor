import { usersApi } from '@/config/api/directory';

import * as actions from './actions';



describe('user actions', () => {
    it('should dispatch API when fetchUser is called', () => {
        const expectedAction = {
            type: 'API',
            endpoint: `${usersApi}/99`,
            dispatchPrefix: 'USERS_USER'
        };

        expect(actions.fetchUser('99')).toEqual(expectedAction);
    });

    it('should dispatch API when updateUser is called', () => {
        const user = {
            id: '10',
            firstName: 'Dean',
            lastName: 'Jackson',
            email: 'dean@gmail.com',
            login: 'dean',
            lastLogin: '',
            lastUpdated: '',
            status: 'ACTIVE',
            organisationId: '12341234'
        };

        const onSuccess = () => {};

        const expectedAction = {
            type: 'API',
            endpoint: `${usersApi}/10`,
            method: 'POST',
            payload: user,
            onSuccess: onSuccess,
            dispatchPrefix: 'USERS_USER_EDIT'
        };

        expect(actions.updateUser(user, onSuccess)).toEqual(expectedAction);
    });
});
